import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Display, Size } from '../../Models/interfaces/Display';
import { LINEARGUAGEOPTIONS } from '../../../shared/utils/chart-options';
import { LinearGauge } from 'canvas-gauges';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { TelemetryAny } from 'src/app/Models/interfaces/Telemetry';
import { jsonConcat } from 'src/shared/utils/formatter';

@Component({
    selector: 'app-display-item-linear',
    templateUrl: './display-item-linear.component.html',
    styleUrls: ['./display-item-linear.component.css']
})
export class DisplayItemLinearComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() screenItem: ScreenItem;
    @ViewChild('guageChart') guageElement: ElementRef;
    @ViewChild('container') containerElement: ElementRef;

    private ngUnsubscribe = new Subject<void>();

    //guageOptions = LINEARGUAGEOPTIONS
    gauge: any;

    LINEARGUAGEOPTIONS: any = {
        height: 200,
        width: 200,
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
        animationDuration: 300,
        animationRule: 'linear'
    };

    constructor(private settingsService: SettingsService, private dataManagerService: DataManagerService) {}

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
        this.LINEARGUAGEOPTIONS = jsonConcat(this.LINEARGUAGEOPTIONS, { renderTo: this.guageElement.nativeElement });
        this.LINEARGUAGEOPTIONS = jsonConcat(this.LINEARGUAGEOPTIONS, this.screenItem.display.options);
        this.gauge = new LinearGauge(this.LINEARGUAGEOPTIONS).draw();
    }

    resizeGuage() {
        this.gauge.update({
            width: this.containerElement.nativeElement.offsetWidth,
            height: this.containerElement.nativeElement.offsetHeight
        });
    }

    updateGuage(telemetry: TelemetryAny | null) {
        if (telemetry == null) {
            return;
        }
        this.gauge.value = telemetry.value;
        this.gauge.update();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
