import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CarData, Display, GraphOption } from '../../interfaces/Display';
import { Chart } from 'chart.js';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { ScreenItem } from 'src/app/interfaces/Screen';

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

    GRAPHOPTIONS: GraphOption = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: null
                }
            },
            animation: {
                duration: 0
            }
        }
    };

    CHARTCOLORS = [
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
    carData: any;
    timeLabel: string = 'time_stamp';
    viewSize: number = 20;
    startFrom: number = 0;

    showLive: boolean = true;
    showLiveIcon = faPause;

    styleObj: any = { width: 400 };

    constructor(private socketService: SocketService, private settingService: SettingsService) {
        //this.socketService.onNewData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => this.updateChartData(data));
        this.settingService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => this.resizeSlider());
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.createChart();
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
            type: this.GRAPHOPTIONS.type,
            options: this.GRAPHOPTIONS.options
        });
    }

    loadChartData() {
        let filteredCarData = this.sliceData(this.carData);
        let graphData: any = [];

        let count: number = 0;
        for (let key in filteredCarData) {
            if (key != this.timeLabel) {
                graphData.push({
                    label: key,
                    data: filteredCarData[key],
                    borderColor: this.CHARTCOLORS[count],
                    backgroundColor: this.CHARTCOLORS[count],
                    fill: false,
                    tension: 0.2
                });
                count++;
            }
        }
        const data: any = {
            labels: filteredCarData[this.timeLabel],
            datasets: graphData
        };

        this.chart.data = data;
        this.chart.update();
    }

    updateChartData(data: any) {
        //clean up for loop
        if (this.carData === undefined) {
            //if on load
            this.carData = data;
            this.loadChartData();
        } else if (Object.keys(data).length === 0) {
            //if data is empty
            return;
        }
        this.carData = data;

        let filteredCarData: any = this.sliceData(this.carData);
        this.chart.data.labels = filteredCarData[this.timeLabel];
        let count = 0;
        for (let key in filteredCarData) {
            if (this.chart.data.datasets) {
                for (let i = 0; i < this.chart.data.datasets.length; i++) {
                    if (this.chart.data.datasets[i].label == key) {
                        this.chart.data.datasets[i].data = filteredCarData[key];
                    }
                }
            }
        }

        this.chart.update();
    }

    sliceData(carData: any) {
        const slicedData: any = {};
        if (this.showLive) {
            this.startFrom = this.toInt(carData[this.timeLabel].length - this.viewSize);
        }
        let endFrom: number;
        this.startFrom + this.viewSize <= carData[this.timeLabel].length ? (endFrom = this.startFrom + this.viewSize) : (endFrom = this.startFrom + (carData[this.timeLabel].length - this.startFrom));
        for (let key of this.screenItem.display.labels) {
            if (Object.keys(carData).includes(key)) {
                //if carData stops having a key then wont be added
                slicedData[key] = carData[key].slice(this.startFrom, endFrom);
            }
        }
        return slicedData;
    }

    setStartFrom(event: any) {
        this.startFrom = event.value;
    }

    toggleShowLive() {
        this.showLive = !this.showLive;
        this.showLiveIcon = this.showLive ? this.faPause : this.faPlay;
    }

    toInt(number: any) {
        if (number === undefined || number < 0) {
            return 0;
        }
        return number;
    }

    resizeSlider() {
        this.styleObj['width'] = this.containerElement.nativeElement.offsetWidth - 30 + 'px';
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
