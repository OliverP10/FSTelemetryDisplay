import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { Display, MoveScreenItem, ResizeScreenItem } from 'src/app/Models/interfaces/Display';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MtxCalendarView, MtxDatetimepickerInput, MtxDatetimepickerInputEvent, MtxDatetimepickerMode, MtxDatetimepickerType } from '@ng-matero/extensions/datetimepicker';
import { MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { LoadingSatus } from 'src/app/Models/enumerations/Telemetry';
import { expandContract, expandContractList } from 'src/app/animations/animations';

@Component({
    selector: 'app-data-analysis',
    templateUrl: './data-analysis.component.html',
    styleUrls: ['./data-analysis.component.css'],
    animations: [expandContractList, expandContract],
    providers: [
        {
            provide: MTX_DATETIME_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'YYYY-MM-DD',
                    monthInput: 'MMMM',
                    yearInput: 'YYYY',
                    timeInput: 'HH:mm',
                    datetimeInput: 'YYYY-MM-DD HH:mm'
                },
                display: {
                    dateInput: 'YYYY-MM-DD',
                    monthInput: 'MMMM',
                    yearInput: 'YYYY',
                    timeInput: 'HH:mm',
                    datetimeInput: 'YYYY-MM-DD HH:mm',
                    monthYearLabel: 'YYYY MMMM',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY',
                    popupHeaderDateLabel: 'MMM DD, ddd'
                }
            }
        }
    ]
})
export class DataAnalysisComponent implements OnInit, AfterViewInit, OnDestroy {
    private ngUnsubscribe = new Subject<void>();

    private count: number = 1;
    screenItems: ScreenItem[] = [this.newAnalysisGraph()];
    displays: Display[] = [
        {
            _id: '',
            title: 'Graph',
            type: 'analysis-graph',
            colSize: 2,
            rowSize: 2,
            labels: [],
            options: {}
        }
    ];
    form: FormGroup;
    loaded: boolean = false;
    showLoadingSpinner: boolean = false;

    constructor(private settingsService: SettingsService, public socketService: SocketService, private dialogRef: MatDialog, private fb: FormBuilder, private dataManagerService: DataManagerService) {
        this.settingsService.setTitle('Data Analysis');
        this.settingsService.setHeaderItems(['add']);
        this.settingsService
            .onToggleAddDispplay()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.toggleAddDisplay());
        this.socketService
            .onTelemetryLoadingSubject()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: LoadingSatus) => (this.showLoadingSpinner = status == LoadingSatus.LOADING ? true : false));
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            from: ['', [Validators.required]],
            to: ['', [Validators.required]]
        });
        this.dataManagerService.findUnqieLabels();
    }

    ngAfterViewInit(): void {
        this.settingsService.resizeEvent(); //once everything is loaded call resize
    }

    onSubmit() {
        this.loaded = true;
        try {
            const from = this.form.value.from;
            const to = this.form.value.to;
            this.socketService.loadCustomModel(from, to);
        } catch (err) {
            console.error(err);
        }
    }

    newAnalysisGraph(): ScreenItem {
        this.count++;
        return {
            display: {
                _id: this.count.toString(),
                title: 'Graph',
                type: 'analysis-graph',
                colSize: 2,
                rowSize: 2,
                labels: [],
                options: {}
            },
            colSize: 2,
            rowSize: 2,
            options: {}
        };
    }

    addScreenItem(display: Display): void {
        let newDisplay = Object.assign({}, display);
        let screenItem: ScreenItem = {
            display: newDisplay,
            colSize: newDisplay.colSize,
            rowSize: newDisplay.rowSize,
            options: {}
        };
        this.screenItems.push(screenItem);
        this.settingsService.resizeEvent();
        this.count++;
    }

    toggleAddDisplay(): void {
        const ref = this.dialogRef.open(AddDisplayComponent, {
            height: '80%',
            width: '50%',
            data: {
                displays: this.displays
            }
        });

        const sub = ref.componentInstance.onAddDisplay.subscribe((display: Display) => {
            this.addScreenItem(display);
        });
    }

    deleteScreenItem(screenItem: ScreenItem): void {
        this.screenItems = this.screenItems.filter((si) => si.display._id !== screenItem.display._id);
        this.count--;
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
        this.settingsService.resizeEvent();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        if (!this.socketService.getLoadLatest()) {
            this.socketService.loadLatestModel();
        }
    }
}
