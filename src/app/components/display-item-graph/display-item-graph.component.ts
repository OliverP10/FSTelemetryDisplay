import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CarData, Display, GraphOption } from '../../Models/interfaces/Display';
import { Chart } from 'chart.js';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryAny } from 'src/app/Models/interfaces/Telemetry';
import { DataManagerService } from 'src/app/services/data-manager.service';

@Component({
    selector: 'app-display-item-graph',
    templateUrl: './display-item-graph.component.html',
    styleUrls: ['./display-item-graph.component.css']
})
export class DisplayItemGraphComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('container') containerElement: ElementRef;
    @ViewChild('chartCanvas') chartCanvas: ElementRef;
    @ViewChild('slider') sliderElement: ElementRef;
    @Input() screenItem: ScreenItem;

    faPlay = faPlay;
    faPause = faPause;
    private ngUnsubscribe = new Subject<void>();
    private ngUnsubscribeTelem = new Subject<void>();

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

    chart: Chart;
    chartOptions: Chart.ChartConfiguration;
    viewSize: number = 30000;
    startFrom: number = 0;

    sliderMin: number = 0;
    sliderMax: number = 1;

    showLive: boolean = true;
    showLiveIcon = faPause;

    styleObj: any = { width: 400 };

    constructor(private socketService: SocketService, private settingService: SettingsService, private dataManagerService: DataManagerService) {
        this.chartOptions = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: null
                    }
                },
                animation: {
                    duration: 0
                },
                scales: {
                    xAxes: [
                        {
                            display: false,
                            type: 'time',
                            ticks: {
                                min: undefined,
                                max: undefined
                            }
                        }
                    ]
                }
            }
        };
    }

    ngOnInit(): void {
        this.settingService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => this.resizeSlider());
        this.socketService
            .onTelemetryReady()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.loadTelemetry(telemetry);
                this.subcribeToTelemLabels();
            });
    }

    ngAfterViewInit(): void {
        this.createChart();
        if (this.dataManagerService.getTelemetryReady()) {
            this.loadTelemetry(this.dataManagerService.telemetry);
            this.subcribeToTelemLabels();
        }
    }

    setViewSize(event: any) {
        const num = parseInt(event.target.value);
        if (num < 200 && num > 1) {
            this.viewSize = num;
        }
    }

    createChart() {
        Chart.defaults.global.defaultFontColor = '#e8e8e8';
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: this.chartOptions.type,
            options: this.chartOptions.options
        });
    }

    loadTelemetry(telemetry: TelemetryAny[]) {
        this.chart.data.datasets = undefined;
        // this.chart.redraw();
        let color = 0;
        let series = new Map<string, Chart.ChartDataSets>();
        for (let label of this.screenItem.display.labels) {
            series.set(label, {
                label: label,
                data: [],
                borderColor: this.chartColors[color],
                backgroundColor: this.chartColors[color],
                fill: false,
                lineTension: 0.1
            });
            color++;
        }

        let minTime: number = 99999999999999;
        let maxTime: number = 0;

        for (let i = 0; i < telemetry.length; i++) {
            if (series.has(telemetry[i].metadata.label)) {
                let s = series.get(telemetry[i].metadata.label);
                (s!.data as Chart.ChartPoint[]).push({
                    y: telemetry[i].value,
                    x: new Date(telemetry[i].timestamp)
                });
                minTime = Math.min(minTime, telemetry[i].timestamp.getTime());
                maxTime = Math.max(maxTime, telemetry[i].timestamp.getTime());
            }
        }

        this.sliderMin = minTime;
        this.sliderMax = maxTime;

        this.startFrom = this.sliderMax - this.viewSize;
        this.chart.options.scales!.xAxes![0].ticks!.max! = this.startFrom + this.viewSize;
        this.chart.options.scales!.xAxes![0].ticks!.min! = this.startFrom;

        const data: Chart.ChartData = {
            labels: this.screenItem.display.labels,
            datasets: Array.from(series.values())
        };

        this.chart.data = data;
        this.chart.update();
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
        if (this.showLive) {
            this.chart.options.scales!.xAxes![0].ticks!.max! = telemetry.timestamp.getTime();
            this.startFrom = telemetry.timestamp.getTime() - this.viewSize;
            this.chart.options.scales!.xAxes![0].ticks!.min! = this.startFrom;
        }
        this.sliderMax = telemetry.timestamp.getTime();
        let chartPoint: Chart.ChartPoint = {
            y: telemetry.value,
            x: new Date(telemetry.timestamp)
        };
        let datasets = this.chart.data.datasets!.find((dataset) => dataset.label == telemetry.metadata.label)!;
        (datasets.data as Chart.ChartPoint[]).push(chartPoint);
        this.chart.update();
    }

    formatLabel(value: number) {
        return Math.round(value / 1000);
    }

    setStartFrom(event: any) {
        this.startFrom = event.value;
        this.chart.options.scales!.xAxes![0].ticks!.max! = this.startFrom + this.viewSize;
        this.chart.options.scales!.xAxes![0].ticks!.min! = this.startFrom;
        this.chart.update();
    }

    toggleShowLive() {
        this.showLive = !this.showLive;
        this.showLiveIcon = this.showLive ? this.faPause : this.faPlay;
    }

    resizeSlider() {
        this.styleObj['width'] = this.containerElement.nativeElement.offsetWidth - 30 + 'px';
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
