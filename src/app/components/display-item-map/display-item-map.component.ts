import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy} from '@angular/core';
import { Display } from "../../Display";
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators"

@Component({
  selector: 'app-display-item-map',
  templateUrl: './display-item-map.component.html',
  styleUrls: ['./display-item-map.component.css']
})
export class DisplayItemMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container') containerElement: ElementRef;
  @ViewChild('map') canvas: ElementRef;
  @Input() display: Display;

  private ngUnsubscribe = new Subject<void>();

  image = new Image()
  ctx: CanvasRenderingContext2D;

  width:number;
  height: number;

  userGPSEnabled: boolean = true
  userWatchId:number
  userUpdateLock: boolean = false
  userRelativePosX:number=0;
  userRelativePosY:number=0;

  carRelativePosX:number=0;
  carRelativePosY:number=0;

  presets = {           //right click google maps//52.621691714945534
    imageTopLeftLat: 52.07912729367632,
    imageTopLeftLon: -1.0208149842756127,

    imageBottomRightLat: 52.07613175372067,
    imageBottomRightLon: -1.0101078479730228,
  }

  constructor(private socketService: SocketService,private settingsService: SettingsService) {
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateCarPos(data)})
    settingsService.onResizeEvent().pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {this.resizeGuage()})
    if(navigator.geolocation) {
      let self = this;
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        self.updateUserPos(position)
      })
      this.userWatchId = navigator.geolocation.watchPosition(
        (position) => { 
          if(!self.userUpdateLock) {  //stops over use when gps low also atomicity violaition
            self.userUpdateLock = true;
            self.updateUserPos(position)
          }
          self.userUpdateLock = false;
        },
        (err) => {
          this.userGPSEnabled=false;
          console.warn("GPS Permissions denied!")
        },
        {
          enableHighAccuracy: true,
        }
      )
    }
  }

  ngOnInit(): void {
    this.image.src = "assets/map-track.jpg";
    let self = this;
    this.image.onload = function() {self.loadMap()};
  }

  ngAfterViewInit() {
  }

  loadMap() {
    this.calculateSize()
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    
    this.drawMap();
  }

  drawMap() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
  }

  updateUserPos(pos:GeolocationPosition) {
    this.userRelativePosY = (pos.coords.latitude - this.presets.imageTopLeftLat) / (this.presets.imageBottomRightLat - this.presets.imageTopLeftLat);
    this.userRelativePosX = (pos.coords.longitude - this.presets.imageTopLeftLon) / (this.presets.imageBottomRightLon - this.presets.imageTopLeftLon);

    this.drawMap();
    this.drawUserPos();
    this.drawCarPos();
  }

  drawUserPos() {
    this.ctx.beginPath();
    this.ctx.arc(this.userRelativePosX*this.width, this.userRelativePosY*this.height, 9, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "rgba(87,145,232,0.7)";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.userRelativePosX*this.width, this.userRelativePosY*this.height, 5, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "rgb(66,133,244)";
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }


  updateCarPos(data:any) {
    this.carRelativePosY = (data[this.display.dataLabels[1]] - this.presets.imageTopLeftLat) / (this.presets.imageBottomRightLat - this.presets.imageTopLeftLat);
    this.carRelativePosX = (data[this.display.dataLabels[0]] - this.presets.imageTopLeftLon) / (this.presets.imageBottomRightLon - this.presets.imageTopLeftLon);

    this.drawMap();
    this.drawCarPos();
    if(this.userGPSEnabled && navigator.geolocation) {
      this.drawUserPos();
    }
  }

  drawCarPos() {
    this.ctx.beginPath();
    this.ctx.arc(this.carRelativePosX*this.width, this.carRelativePosY*this.height, 9, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "rgba(209, 67, 27,0.4)";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.carRelativePosX*this.width, this.carRelativePosY*this.height, 5, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "rgba(222, 93, 58,0.9)";
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }

  resizeGuage() {
    this.loadMap();
    this.drawMap();
    if(this.userGPSEnabled) {
      this.drawUserPos(); //only draw if gps
    }
    this.drawCarPos();
  }

  calculateSize() {
    const widthRatio = (this.containerElement.nativeElement.offsetWidth-10) / this.image.naturalWidth 
    const heightRatio = (this.containerElement.nativeElement.offsetHeight-20) / this.image.naturalHeight; //deducts from the 10px margin in css and adds another 10px at the bottom

    const ratio = Math.min(widthRatio, heightRatio);

    this.width = this.image.width * ratio;
    this.height = this.image.height * ratio;
  }

  ngOnDestroy() {
    if(this.userGPSEnabled && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.userWatchId);
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
