import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { defer, Subject, takeUntil } from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import * as HighchartsBoost from 'highcharts/modules/boost';

import { SettingsService } from 'src/app/services/settings.service';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { TelemetryAny } from 'src/app/Models/interfaces/Telemetry';
import { SocketService } from 'src/app/services/socket.service';
import { GraphData, SeriesOption } from 'src/app/Models/interfaces/Graph';

@Component({
    selector: 'app-display-graph',
    templateUrl: './display-graph.component.html',
    styleUrls: ['./display-graph.component.css']
})
export class DisplayGraphComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() screenItem: ScreenItem;
    private ngUnsubscribe = new Subject<void>();
    private ngUnsubscribeTelem = new Subject<void>();

    CHARTCOLORS = [
        'rgb(234, 184, 3)',
        'rgb(235, 30, 190)',
        'rgb(237, 72, 31)',
        'rgb(34, 186, 36)',
        'rgb(247, 247, 247)',
        'rgb(107, 52, 235)',
        'rgb(0, 81, 255)',
        'rgb(201, 203, 207)',
        'rgb(255, 205, 86)',
        'rgb(50, 168, 82)',
        'rgb(235, 52, 174)',
        'rgb(235, 64, 52)',
        'rgb(52, 64, 235)'
    ];
    maxPoints = 150;

    chart: Highcharts.Chart;
    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options;

    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chart = chart;
    };

    constructor(private settingsService: SettingsService, private dataManagerService: DataManagerService, private socketService: SocketService) {}

    ngOnInit(): void {
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: ''
            }
        });
        this.chartOptions = {
            series: [],
            chart: {
                backgroundColor: 'transparent',
                style: {
                    fontFamily: 'monospace',
                    color: 'rgb(202, 208, 220)',
                    fontSize: '10px'
                },
                animation: {
                    duration: 0
                }
            },
            title: {
                text: ''
            },
            legend: {
                itemStyle: {
                    color: 'rgb(202, 208, 220)'
                }
            },
            yAxis: [
                {
                    labels: {
                        style: {
                            color: 'rgb(202, 208, 220)'
                        }
                    },
                    gridLineColor: 'rgb(98, 108, 132)'
                }
            ],
            xAxis: {
                labels: {
                    style: {
                        color: 'rgb(202, 208, 220)'
                    }
                },
                gridLineColor: 'rgb(98, 108, 132)',
                ordinal: false
            },
            rangeSelector: {
                selected: 0,
                verticalAlign: 'top',
                buttonPosition: {
                    align: 'right',
                    x: 0,
                    y: 0
                },
                inputPosition: {
                    align: 'left',
                    x: 0,
                    y: 0
                },
                buttonTheme: {
                    style: {
                        color: 'black'
                    },
                    fill: 'rgb(98, 108, 132)',
                    states: {
                        hover: {
                            stroke: 'none',
                            fill: 'rgb(117, 117, 117)',
                            style: {}
                        },
                        select: {
                            stroke: 'none',
                            fill: '#666666',
                            style: {
                                color: 'rgb(202, 208, 220)'
                            }
                        }
                    }
                },

                buttons: [
                    {
                        count: 30,
                        type: 'second',
                        text: '30s'
                    },
                    {
                        count: 1,
                        type: 'minute',
                        text: '1m'
                    },
                    {
                        type: 'all',
                        text: 'All'
                    }
                ],
                inputEnabled: false
            },
            scrollbar: {
                enabled: false,
                barBackgroundColor: 'rgb(77, 84, 101)',
                barBorderRadius: 4,
                barBorderWidth: 0,
                buttonBackgroundColor: 'rgb(77, 84, 101)',
                buttonBorderWidth: 0,
                buttonArrowColor: 'rgb(202, 208, 220)',
                buttonBorderRadius: 4,
                rifleColor: 'rgb(202, 208, 220)',
                trackBackgroundColor: 'rgb(91, 107, 128)',
                trackBorderWidth: 1,
                trackBorderColor: 'rgb(202, 208, 220)',
                trackBorderRadius: 4
            },
            navigator: {
                handles: {
                    backgroundColor: 'rgb(202, 208, 220)',
                    borderColor: 'rgb(98, 108, 132)'
                },
                series: {
                    lineWidth: 1,
                    fillOpacity: 0
                }
            },
            exporting: {
                enabled: false
            },
            accessibility: {
                enabled: false
            },
            time: {
                useUTC: false
            },
            plotOptions: {
                series: {
                    //turboThreshold: 500,
                    showInNavigator: true,
                    animation: false
                }
            },
            boost: {
                useGPUTranslations: true,
                seriesThreshold: 1
            },
            colors: this.CHARTCOLORS
        };

        this.settingsService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.resizeChart();
            });

        this.socketService
            .onTelemetryReady()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.loadTelemetry(telemetry);
                this.subcribeToTelemLabels();
            });
    }

    ngAfterViewInit(): void {
        if (this.dataManagerService.getTelemetryReady()) {
            this.loadTelemetry(this.dataManagerService.telemetry);
            this.subcribeToTelemLabels();
        }
    }

    loadTelemetry(telemetry: TelemetryAny[]) {
        while (this.chart.series.length) {
            this.chart.series[0].remove();
        }
        this.chart.redraw();
        let series = new Map<string, SeriesOption>();
        for (let label of this.screenItem.display.labels) {
            series.set(label, { name: label, data: [], type: 'line' });
        }

        let pointCounter = 0;
        for (let i = telemetry.length - 1; i > 0; i--) {
            if (series.has(telemetry[i].metadata.label)) {
                let s = series.get(telemetry[i].metadata.label);
                s!.data.push({
                    y: telemetry[i].value,
                    x: new Date(telemetry[i].timestamp).getTime()
                });

                if (pointCounter > this.maxPoints * this.screenItem.display.labels.length) {
                    break;
                } else {
                    pointCounter++;
                }
            }
        }
        for (let s of series.values()) {
            s.data.reverse();
            this.chart.addSeries(s as Highcharts.SeriesOptionsType);
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
        let graphPlot: GraphData = {
            y: telemetry.value,
            x: new Date(telemetry.timestamp).getTime()
        };
        let series = this.chart.series.find((series) => series.name == telemetry.metadata.label);
        this.chart.series[0].data.length > this.maxPoints ? series!.addPoint(graphPlot, true, true, false) : series!.addPoint(graphPlot);
    }

    autoRemove() {
        let pointsToRemove = this.chart.series[0].data.length - this.maxPoints;
        for (let i = 0; i < pointsToRemove; i++) {
            for (const series of this.chart.series) {
                series.removePoint(i, false);
            }
        }
        this.chart.redraw();
    }

    resizeChart() {
        this.chart.reflow();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribeTelem.next();
        this.ngUnsubscribeTelem.complete();
    }
}