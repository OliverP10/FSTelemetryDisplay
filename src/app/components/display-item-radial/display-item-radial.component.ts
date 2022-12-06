import { Component, Input, ElementRef, ViewChild, AfterViewInit, AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { Display, Size } from '../../Models/interfaces/Display';
import { RADIALGUAGEOPTIONS } from '../../../shared/utils/chart-options';
import { RadialGauge } from 'canvas-gauges';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
import { jsonConcat } from 'src/shared/utils/formatter';

@Component({
    selector: 'app-display-item-radial',
    templateUrl: './display-item-radial.component.html',
    styleUrls: ['./display-item-radial.component.css']
})
export class DisplayItemRadialComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() screenItem: ScreenItem;
    @ViewChild('guageChart') guageElement: ElementRef;
    @ViewChild('container') containerElement: ElementRef;

    private ngUnsubscribe = new Subject<void>();

    gauge: any;

    RADIALGUAGEOPTIONS: any = {
        width: 200,
        height: 200,
        strokeTicks: true,
        colorPlate: '#FFFFFF00',
        colorMajorTicks: 'rgb(51, 145, 245)',
        colorMinorTicks: 'rgb(51, 145, 245)',
        colorUnits: 'rgb(51, 145, 245)',
        colorNeedle: 'rgba(234, 184, 3, 1)',
        colorNeedleEnd: 'rgba(234, 184, 3, 1)',
        colorValueBoxRect: '#FFFFFF00',
        colorValueBoxBackground: '#FFFFFF00',
        colorValueText: 'rgba(234, 184, 3, 1)',
        colorNumbers: '#e8e8e8',
        colorValueBoxRectEnd: '#FFFFFF00',
        borderShadowWidth: 0,
        borders: false,
        needleType: 'arrow',
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 0, //60
        animationRule: 'linear',
        animation: false
    };

    constructor(private dataManagerService: DataManagerService, private settingsService: SettingsService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.createGuage();
        this.settingsService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.resizeGuage();
            });
        this.dataManagerService
            .onCustomTelemetry(this.screenItem.display.labels[0])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateGuage(telemetry);
            });
    }

    createGuage() {
        this.RADIALGUAGEOPTIONS = jsonConcat(this.RADIALGUAGEOPTIONS, { renderTo: this.guageElement.nativeElement });
        this.RADIALGUAGEOPTIONS = jsonConcat(this.RADIALGUAGEOPTIONS, this.screenItem.display.options); //will overide defulat settings with new settings
        this.gauge = new RadialGauge(this.RADIALGUAGEOPTIONS).draw();
    }

    resizeGuage() {
        this.gauge.update({
            width: this.containerElement.nativeElement.offsetWidth,
            height: this.containerElement.nativeElement.offsetHeight
        });
    }

    public updateGuage(telemetry: TelemetryNumber | null) {
        if (telemetry == null) {
            return;
        }
        // if (this.screenItem.display.options.hasOwnProperty('titleAsValue')) {
        //     this.gauge.update({ title: telemetry.value == 0 ? '0°' : telemetry.value + '°' });
        // }
        this.gauge.value = telemetry.value;
        this.gauge.update();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
