import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Display, MoveDisplay, ResizeDisplay, Screen, ROOT_URL } from '../../Display';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/services/socket.service';
import { expandContractList,  } from 'src/app/animations';


@Component({
  selector: 'app-displays',
  templateUrl: './displays.component.html',
  styleUrls: ['./displays.component.css'],
  animations: [
    expandContractList,
  ]
})

export class DisplaysComponent implements OnInit,AfterViewInit {
  readonly URL = ROOT_URL+':3200';
  screens: Screen;  //key is a screen and value is a list of display ids
  allDisplays: Display[] = [];  //All saved displays on server
  currentDisplays: Display[] = [];  //Displays being show
  key_presses = new Set<string>()

  constructor(private http: HttpClient,private settingsService: SettingsService,private socketService: SocketService, private snackBar: MatSnackBar) {
    settingsService.onSetView().subscribe((view) => {this.loadDisplays(view)});
  }

  ngOnInit(): void {
    forkJoin(
      {
        allDisplays: this.http.get<Display[]>(this.URL+'/displays'),
        screens: this.http.get<Display[]>(this.URL+'/screens')
      }
    ).subscribe((data: any)=>{
      this.allDisplays=data.allDisplays.displays;
      this.screens=data.screens.screens;
      this.loadDisplays(this.settingsService.view);
    })
  }

  ngAfterViewInit(): void {
    this.settingsService.resizeEvent()  //once everything is loaded call resize
  }

  loadDisplays(view:String) {
    this.currentDisplays = []
    for(let screenItem of this.screens[view as keyof typeof this.screens]) {
      let display:Display = this.allDisplays.filter(d => d.id === screenItem.id)[0]
      display.colSize = screenItem.colSize,
      display.rowSize = screenItem.rowSize
      this.addDisplay(display);
    }
  }

  addDisplay(display:Display): void {
    if(!this.containsObject(display,this.currentDisplays)){
      this.currentDisplays.push(display);
    }
    this.settingsService.resizeEvent();
  }

  containsObject(display:Display, list:Display[]) {
    for(let d of list) {
      if (d.id == display.id){
        return true;
      }
    }
    return false;
  }

  deleteDisplay(display:Display): void {
    let index = this.currentDisplays.indexOf(display)
    this.currentDisplays.splice(index, 1);
  }

  moveDisplay(moveDisplay:MoveDisplay): void {
    let index = this.currentDisplays.indexOf(moveDisplay.display);
    let swapDirection = (moveDisplay.direction=="left") ? -1 : +1;
    if (moveDisplay.direction=="left" && index+swapDirection >= 0 || moveDisplay.direction=="right" && index+swapDirection < this.currentDisplays.length) {
      let temp = this.currentDisplays[index];
      this.currentDisplays[index] = this.currentDisplays[index+swapDirection]
      this.currentDisplays[index+swapDirection] = temp;
    }
  }

  resizeDisplay(resizeDisplay:ResizeDisplay): void {
    let index = this.currentDisplays.indexOf(resizeDisplay.display);
    if (resizeDisplay.axis == "vertical" && this.currentDisplays[index].rowSize+resizeDisplay.change <= 4 && this.currentDisplays[index].rowSize+resizeDisplay.change > 0) {
      this.currentDisplays[index].rowSize+= resizeDisplay.change
    } else if (resizeDisplay.axis == "horizontal" && this.currentDisplays[index].colSize+resizeDisplay.change <= 4 && this.currentDisplays[index].colSize+resizeDisplay.change > 0) {
      this.currentDisplays[index].colSize+= resizeDisplay.change
    }
  }

  saveScreen() {  //need proper backend to do a put request for now just post
    if(this.settingsService.view=="custom") {return}
    const updateData = {
      screensName: this.settingsService.view,
      screens: this.currentDisplays.map((d:Display)=>({
        id:d.id,
        colSize:d.colSize,
        rowSize:d.rowSize
      })),
    }
    this.screens[updateData.screensName as keyof typeof this.screens] = updateData.screens
    this.http.post<any>(this.URL+"/update", updateData).subscribe({
      next: (v) => {
        this.snackBar.open("Saved","Dismiss",{duration: 3000});
      },
      error: (e) => {this.snackBar.open(e.error.errors[0].msg,"Dismiss",{duration: 3000})},
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    if (!this.key_presses.has(event.key)) {
      this.socketService.sendKeyFrame(event.key+'_d')
      this.key_presses.add(event.key)
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (this.key_presses.has(event.key)) {
      this.socketService.sendKeyFrame(event.key+'_u')
      this.key_presses.delete(event.key)
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.settingsService.resizeEvent();
  }

  



}
