import {Component, Input, ElementRef,ViewChild, AfterViewInit , AfterContentInit, OnDestroy} from '@angular/core';
import { Display, Size } from "../../Display";
import { RADIALGUAGEOPTIONS } from "../../chart-options";
import { RadialGauge } from 'canvas-gauges';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators"

@Component({
  selector: 'app-display-item-radial',
  templateUrl: './display-item-radial.component.html',
  styleUrls: ['./display-item-radial.component.css']
})

export class DisplayItemRadialComponent implements AfterViewInit, OnDestroy {
  @Input() display: Display;
  @ViewChild('guageChart') guageElement: ElementRef;
  @ViewChild('container') containerElement: ElementRef;

  private ngUnsubscribe = new Subject<void>();

  gauge: any;

  RADIALGUAGEOPTIONS: any = {
    width: 200,
    height: 200,
    strokeTicks: true,
    colorPlate: "#FFFFFF00",
    colorMajorTicks: 'rgb(51, 145, 245)',
    colorMinorTicks:'rgb(51, 145, 245)',
    colorUnits: 'rgb(51, 145, 245)',
    colorNeedle: 'rgba(234, 184, 3, 1)',
    colorNeedleEnd: 'rgba(234, 184, 3, 1)',
    colorValueBoxRect:"#FFFFFF00",
    colorValueBoxBackground:"#FFFFFF00",
    colorValueText: 'rgba(234, 184, 3, 1)',
    colorNumbers: "#e8e8e8",
    colorValueBoxRectEnd: "#FFFFFF00",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 50,
    animationRule: "linear"
  }

  constructor(private socketService: SocketService,private settingsService: SettingsService) {
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateGuage(data)})
    settingsService.onResizeEvent().pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {this.resizeGuage()})
  }

  ngAfterViewInit(): void {
    this.createGuage();
  }

  createGuage() {
    this.RADIALGUAGEOPTIONS = this.jsonConcat(this.RADIALGUAGEOPTIONS,{renderTo: this.guageElement.nativeElement})
    this.RADIALGUAGEOPTIONS = this.jsonConcat(this.RADIALGUAGEOPTIONS,this.display.options);  //will overide defulat settings with new settings
    this.gauge = new RadialGauge(this.RADIALGUAGEOPTIONS).draw();
  }

  jsonConcat(o1:any, o2:any) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }

  resizeGuage() {
    this.gauge.update({
      width: this.containerElement.nativeElement.offsetWidth,
      height: this.containerElement.nativeElement.offsetHeight
    });
  }

  updateGuage(data:any){
    if(this.display.options.hasOwnProperty('titleAsValue')) {
      this.gauge.update({ title: (data[this.display.dataLabels[0]]==0) ? "0°" : data[this.display.dataLabels[0]]+"°"  })
    }

    this.gauge.value = data[this.display.dataLabels[0]]
    this.gauge.update();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }



}
