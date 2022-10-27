import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScreenItem } from 'src/app/interfaces/Screen';
import { Display, MoveScreenItem, ResizeScreenItem } from 'src/app/interfaces/Display';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-data-analysis',
    templateUrl: './data-analysis.component.html',
    styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit, AfterViewInit {
    private ngUnsubscribe = new Subject<void>();

    private count: number = 1;
    screenItems: ScreenItem[] = [this.newAnalysisGraph()];

    displays: Display[] = [
        {
            _id: '',
            title: 'Graph ',
            type: 'analysis-graph',
            colSize: 2,
            rowSize: 2,
            labels: [],
            options: {}
        }
    ];

    constructor(private settingsService: SettingsService, public socketService: SocketService, private dialogRef: MatDialog) {
        this.settingsService.setHeaderItems(['add']);
        this.settingsService
            .onToggleAddDispplay()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.toggleAddDisplay());
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.settingsService.resizeEvent(); //once everything is loaded call resize
    }

    newAnalysisGraph(): ScreenItem {
        return {
            display: {
                _id: '',
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
        let screenItem: ScreenItem = {
            display: display,
            colSize: display.colSize,
            rowSize: display.rowSize,
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
}
