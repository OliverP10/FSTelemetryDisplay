import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CarData, Display, GraphOption } from '../../Models/interfaces/Display';
import { Chart } from 'chart.js';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { faPlay, faPause, faGear } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryAny } from 'src/app/Models/interfaces/Telemetry';
import DataManagerService from 'src/app/services/data-manager.service';
import { jsonConcat } from 'src/shared/utils/formatter';
import { GraphOptions } from 'src/app/Models/interfaces/Graph';

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

    chart: Chart;
    chartOptions: Chart.ChartConfiguration;
    graphOptions: GraphOptions;
    telemLoaded: Boolean = false;

    counters = new Map<string, number>();

    minTime = 999999999999999;
    maxTime = 0;

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
                            type: 'time', //time logarithmic
                            ticks: {
                                min: undefined,
                                max: undefined
                            }
                        }
                    ]
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'x'
                },
                elements: {
                    point: {
                        radius: 1,
                        hoverRadius: 1
                    }
                }
            }
        };
    }

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
        Chart.defaults.global.defaultFontColor = '#e8e8e8';
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: this.chartOptions.type,
            options: this.chartOptions.options
        });
    }

    loadTelemetry(telemetry: TelemetryAny[]) {
        this.telemLoaded = true;
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
                lineTension: 0.01,
                borderWidth: 2
            });
            this.counters.set(label, 0);
            color++;
        }

        for (let i = telemetry.length - 1; i > 0; i--) {
            let label = telemetry[i].metadata.label;
            if (series.has(label) && this.counters.get(label)! < this.graphOptions.maxPoints) {
                let s = series.get(label);
                (s!.data as Chart.ChartPoint[]).unshift({
                    y: telemetry[i].value,
                    x: new Date(telemetry[i].timestamp)
                });

                this.counters.set(label, this.counters.get(label)! + 1);
                if (Array.from(this.counters.values()).every((counter) => counter >= this.graphOptions.maxPoints)) {
                    break;
                }
            }
        }

        const data: Chart.ChartData = {
            labels: this.screenItem.display.labels,
            datasets: Array.from(series.values())
        };
        this.chart.data = data;
        this.chart.options.scales!.xAxes![0].ticks!.max! = this.findMax();
        this.chart.options.scales!.xAxes![0].ticks!.min! = this.calcMin();
        console.log(this.chart.data.datasets);
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
        if (telemetry == null || this.telemLoaded == false) {
            return;
        }
        let chartPoint: Chart.ChartPoint = {
            y: telemetry.value,
            x: new Date(telemetry.timestamp)
        };
        let datasets = this.chart.data.datasets!.find((dataset) => dataset.label == telemetry.metadata.label)!;

        if (this.counters.get(telemetry.metadata.label)! >= this.graphOptions.maxPoints) {
            (datasets.data as Chart.ChartPoint[]).shift();
        }

        (datasets.data as Chart.ChartPoint[]).push(chartPoint);

        if (this.showLive) {
            this.chart.options.scales!.xAxes![0].ticks!.max! = this.findMax();
            this.chart.options.scales!.xAxes![0].ticks!.min! = this.calcMin();
        }
        this.updateChartOnNextComplete = true;
        // this.chart.update();
    }

    updateChart() {
        if (this.updateChartOnNextComplete) {
            this.chart.update();
            this.updateChartOnNextComplete = false;
        }
    }

    calcMin() {
        let min: number = this.findMax() - this.graphOptions.viewSize;
        return min;
    }

    findMax(): number {
        let max: number = 0;
        for (let dataset of this.chart.data.datasets!) {
            if (dataset.data!.length > 0) {
                max = Math.max(max, ((dataset.data![dataset.data!.length - 1] as Chart.ChartPoint).x as Date).getTime());
            }
        }
        return max;
    }

    toggleShowLive() {
        this.showLive = !this.showLive;
        this.showLiveIcon = this.showLive ? this.faPause : this.faPlay;
    }

    updateViewSize(event: any) {
        this.screenItem.options['viewSize'] = event.target.value;
        this.chart.update();
    }

    updateMaxPoints(event: any) {
        this.screenItem.options['maxPoints'] = event.target.value;
        this.chart.update();
    }

    stopPropagation(event: any) {
        event.stopPropagation();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribeTelem.next();
        this.ngUnsubscribeTelem.complete();
    }
}
