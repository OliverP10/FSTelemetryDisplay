import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Display, MoveScreenItem, ResizeScreenItem } from '../../interfaces/Display';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/services/socket.service';
import { expandContractList } from 'src/app/animations/animations';
import { environment } from 'src/environments/environment';
import { DBScreenItem, Screen, ScreenItem } from 'src/app/interfaces/Screen';
import { objectListToMap } from 'src/shared/utils/formatter';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-screens',
    templateUrl: './screens.component.html',
    styleUrls: ['./screens.component.css'],
    animations: [expandContractList]
})
export class ScreensComponent implements OnInit, AfterViewInit {
    readonly URL = environment.ROOT_URL + environment.API_PORT;
    screens: Map<string, Screen> = new Map<string, Screen>(); //key is a screen and value is a list of display ids
    displays: Display[] = []; //All saved displays on server
    screenItems: ScreenItem[] = []; //Displays being show
    key_presses = new Set<string>();

    constructor(private http: HttpClient, private settingsService: SettingsService, private socketService: SocketService, private snackBar: MatSnackBar) {
        settingsService.onSetView().subscribe((view) => {
            this.loadScreen(view);
        });
    }

    ngOnInit(): void {
        forkJoin({
            displays: this.http.get<Display[]>(this.URL + '/display/get'),
            screens: this.http.get<Screen[]>(this.URL + '/screen/get')
        }).subscribe((data: any) => {
            this.displays = data.displays.display;
            this.screens = objectListToMap('name', data.screens.screen);
            this.loadScreen(this.settingsService.view);
        });
    }

    ngAfterViewInit(): void {
        this.settingsService.resizeEvent(); //once everything is loaded call resize
    }

    loadScreen(screenName: string) {
        this.screenItems = [];
        let screen: Screen = this.screens.get(screenName)!;
        this.screenItems = screen.screenItems;
        this.settingsService.resizeEvent();
    }

    addScreenItem(display: Display): void {
        if (typeof this.screenItems.find((si) => si.display._id === display._id) === 'undefined') {
            let screenItem: ScreenItem = {
                display: display,
                colSize: display.colSize,
                rowSize: display.rowSize,
                options: {}
            };
            this.screenItems.push(screenItem);
        }
        this.settingsService.resizeEvent();
    }

    deleteScreenItem(screenItem: ScreenItem): void {
        this.screenItems = this.screenItems.filter((si) => si.display._id !== screenItem.display._id);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.screenItems, event.previousIndex, event.currentIndex);
    }

    moveScreenItem(moveScreenItem: MoveScreenItem): void {
        let index = this.screenItems.indexOf(moveScreenItem.screenItem);
        let swapDirection = moveScreenItem.direction == 'left' ? -1 : +1;
        if ((moveScreenItem.direction == 'left' && index + swapDirection >= 0) || (moveScreenItem.direction == 'right' && index + swapDirection < this.screenItems.length)) {
            let temp = this.screenItems[index];
            this.screenItems[index] = this.screenItems[index + swapDirection];
            this.screenItems[index + swapDirection] = temp;
        }
    }

    resizeScreenItem(resizeScreenItem: ResizeScreenItem): void {
        let index = this.screenItems.indexOf(resizeScreenItem.screenItem);
        if (resizeScreenItem.axis == 'vertical' && this.screenItems[index].rowSize + resizeScreenItem.change <= 4 && this.screenItems[index].rowSize + resizeScreenItem.change > 0) {
            this.screenItems[index].rowSize += resizeScreenItem.change;
        } else if (resizeScreenItem.axis == 'horizontal' && this.screenItems[index].colSize + resizeScreenItem.change <= 4 && this.screenItems[index].colSize + resizeScreenItem.change > 0) {
            this.screenItems[index].colSize += resizeScreenItem.change;
        }
    }

    saveScreen() {
        //need proper backend to do a put request for now just post
        if (this.settingsService.view == 'custom') {
            return;
        }
        let screensItems = this.screenItems.map((s: ScreenItem) => ({ display: s.display._id, colSize: s.colSize, rowSize: s.rowSize, options: s.options }));
        this.http.patch<ScreenItem[]>(this.URL + '/screen/update/' + this.settingsService.view, { screenItems: screensItems }).subscribe({
            next: (v) => {
                this.snackBar.open('Saved', 'Dismiss', { duration: 3000 });
            },
            error: (e: HttpErrorResponse) => {
                this.snackBar.open(e.error.message, 'Dismiss', {
                    duration: 3000
                });
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardDownEvent(event: KeyboardEvent) {
        if (!this.key_presses.has(event.key)) {
            this.socketService.sendKeyFrame(event.key + '_d');
            this.key_presses.add(event.key);
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardUpEvent(event: KeyboardEvent) {
        if (this.key_presses.has(event.key)) {
            this.socketService.sendKeyFrame(event.key + '_u');
            this.key_presses.delete(event.key);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.settingsService.resizeEvent();
    }
}
