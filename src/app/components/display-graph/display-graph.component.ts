import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { Subject, takeUntil } from 'rxjs';
import { faPlay, faPause, faGear } from '@fortawesome/free-solid-svg-icons';

import { SettingsService } from 'src/app/services/settings.service';
import DataManagerService from 'src/app/services/data-manager.service';
import { TelemetryAny } from 'src/app/Models/interfaces/Telemetry';
import { SocketService } from 'src/app/services/socket.service';
import { GraphData, GraphOptions, SeriesOption } from 'src/app/Models/interfaces/Graph';
import { jsonConcat } from 'src/shared/utils/formatter';
import Dygraph from 'dygraphs';

@Component({
    selector: 'app-display-graph',
    templateUrl: './display-graph.component.html',
    styleUrls: ['./display-graph.component.css']
})
export class DisplayGraphComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('container') containerElement: ElementRef;
    @ViewChild('graph') graphElement: ElementRef;
    @Input() screenItem: ScreenItem;

    faGear = faGear;
    faPlay = faPlay;
    faPause = faPause;
    private ngUnsubscribe = new Subject<void>();
    private ngUnsubscribeTelem = new Subject<void>();
    updateChartOnNextComplete: boolean = false;

    chartColors = [
        'rgba(234, 184, 3)',
        'rgba(235, 30, 190)',
        'rgba(237, 72, 31)',
        'rgba(34, 186, 36)',
        'rgba(247, 247, 247)',
        'rgba(107, 52, 235)',
        'rgba(0, 81, 255)',
        'rgba(201, 203, 207)',
        'rgba(255, 205, 86)',
        'rgba(50, 168, 82)',
        'rgba(235, 52, 174)',
        'rgba(235, 64, 52)',
        'rgba(52, 64, 235)'
    ];

    graphOptions: GraphOptions;
    data: any = [];
    chart: any;

    series: string[] = ['time'];

    minTime = 999999999999999;
    maxTime = 0;

    showLive: boolean = true;
    showLiveIcon = faPause;

    constructor(private socketService: SocketService, private settingsService: SettingsService, private dataManagerService: DataManagerService) {}

    ngOnInit(): void {
        this.graphOptions = jsonConcat(this.screenItem.display.options, this.screenItem.options);

        this.socketService
            .onTelemetryReady()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.setup(telemetry);
            });
    }

    ngAfterViewInit(): void {
        this.createChart();
        this.settingsService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.resizeGraph();
            });
        if (this.dataManagerService.getTelemetryReady()) {
            this.loadTelemetry(this.dataManagerService.telemetry);
            this.subcribeToTelemLabels();

            this.dataManagerService
                .onTelemetryComplete()
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(() => {
                    this.updateChart();
                });
        }
    }

    setup(telemetry: TelemetryAny[]) {
        this.subcribeToTelemLabels();
        this.loadTelemetry(telemetry);

        this.dataManagerService
            .onTelemetryComplete()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.updateChart();
            });
    }

    createChart() {
        this.chart = new Dygraph(this.graphElement.nativeElement, this.data, {
            legend: 'always',
            labelsDiv: 'legend',
            showLabelsOnHighlight: true,
            hideOverlayOnMouseOut: true,
            axisLabelWidth: 50,
            interactionModel: null,
            connectSeparatedPoints: true,
            rollPeriod: 1,
            width: 500,
            height: 200
        });
    }

    loadTelemetry(telemetry: TelemetryAny[]) {
        this.data = [];
        this.series.push(...this.screenItem.display.labels);
        for (let i = telemetry.length - 1; i > 0; i--) {
            let collumn = this.series.indexOf(telemetry[i].metadata.label);
            if (collumn != -1) {
                // check if the row above is same timestamp uf it is dont create new row
                if (this.data.length && this.data[0][0].getTime() == telemetry[i].timestamp.getTime()) {
                    this.data[0][collumn] = telemetry[i].value;
                } else {
                    let row = new Array(this.series.length).fill(null);
                    row[0] = new Date(telemetry[i].timestamp);
                    row[collumn] = telemetry[i].value;
                    this.data.unshift(row);
                }

                if (this.data.length > this.graphOptions.maxPoints) {
                    break;
                }
            }
        }

        this.chart.updateOptions({
            labels: this.series
        });

        if (this.data.length) {
            this.chart.updateOptions({
                labels: this.series,
                file: this.data,
                dateWindow: [this.data[this.data.length - 1][0].getTime() - this.graphOptions.viewSize, this.data[this.data.length - 1][0]]
            });
        }
    }

    subcribeToTelemLabels() {
        this.ngUnsubscribeTelem.next();
        this.ngUnsubscribeTelem.complete();
        this.ngUnsubscribeTelem = new Subject<void>();
        let observables = this.dataManagerService.onCustomTelemetryAsList(this.screenItem.display.labels);
        for (let observable of observables) {
            observable.pipe(takeUntil(this.ngUnsubscribeTelem)).subscribe((telemetry) => {
                this.addTelemetry(telemetry);
            });
        }
    }

    addTelemetry(telemetry: TelemetryAny | null) {
        if (telemetry == null) {
            return;
        }

        let collumn = this.series.indexOf(telemetry.metadata.label);

        let time1 = this.data.length && this.data[this.data.length - 1][0].getTime();
        let time2 = telemetry.timestamp.getTime();
        if (this.data.length && this.data[this.data.length - 1][0].getTime() == telemetry.timestamp.getTime()) {
            this.data[this.data.length - 1][collumn] = telemetry.value;
        } else {
            let row = new Array(this.series.length).fill(null);
            row[0] = new Date(telemetry.timestamp);
            row[collumn] = telemetry.value;
            this.data.push(row);
        }

        if (this.data.length > this.graphOptions.maxPoints) {
            this.data.shift();
        }

        this.updateChartOnNextComplete = true;
    }

    updateChart() {
        if (this.updateChartOnNextComplete) {
            if (this.showLive) {
                this.chart.updateOptions({
                    file: this.data,
                    dateWindow: [this.data[this.data.length - 1][0].getTime() - this.graphOptions.viewSize, this.data[this.data.length - 1][0]]
                });
            } else {
                this.chart.updateOptions({
                    file: this.data
                });
            }
            this.updateChartOnNextComplete = false;
        }
    }

    toggleShowLive() {
        this.showLive = !this.showLive;
        this.showLiveIcon = this.showLive ? this.faPause : this.faPlay;
    }

    updateViewSize(event: any) {
        this.screenItem.options['viewSize'] = event.target.value;
    }

    updateMaxPoints(event: any) {
        this.screenItem.options['maxPoints'] = event.target.value;
    }

    stopPropagation(event: any) {
        event.stopPropagation();
    }

    resizeGraph() {
        this.chart.resize(this.containerElement.nativeElement.offsetWidth, this.containerElement.nativeElement.offsetHeight);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribeTelem.next();
        this.ngUnsubscribeTelem.complete();
    }
}
