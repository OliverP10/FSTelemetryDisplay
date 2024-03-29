import { Component, ElementRef, Input, OnDestroy, OnInit, AfterViewInit, ViewChild, Output } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil, timestamp } from 'rxjs';
import { Event, TableEvent } from 'src/app/Models/interfaces/Events';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';
import { faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { expandContract } from 'src/app/animations/animations';
import { LoadingSatus } from 'src/app/Models/enumerations/Telemetry';

@Component({
    selector: 'app-display-events',
    templateUrl: './display-events.component.html',
    styleUrls: ['./display-events.component.css'],
    animations: [expandContract]
})
export class DisplayEventsComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() screenItem: ScreenItem;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<TableEvent[]>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    faTriangleExclamation = faTriangleExclamation;
    faCircleInfo = faCircleInfo;

    private ngUnsubscribe = new Subject<void>();
    dataSource: MatTableDataSource<TableEvent>;
    displayedColumns: string[];
    mode = 'All Events';
    searchText: string = '';
    pageSize: number = 3;
    showLoadingSpinner: boolean = false;

    constructor(private socketService: SocketService, public dataManagerService: DataManagerService) {
        this.displayedColumns = ['symbol', 'timestamp', 'type', 'trigger', 'message'];
        this.dataSource = new MatTableDataSource();
        this.socketService
            .onEventsReady()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((events) => {
                this.setEvents(this.reformatEvent(events));
            });
        this.dataManagerService
            .onEvents()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((events) => {
                this.addEvents(this.reformatEvent(events));
            });
        this.socketService
            .onEventsLoadingSubject()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: LoadingSatus) => (this.showLoadingSpinner = status == LoadingSatus.LOADING ? true : false));
    }

    ngOnInit(): void {
        this.pageSize = this.screenItem.options.pageSize;
        if (this.dataManagerService.getEventsReady()) {
            setTimeout(() => {
                //some reason dom nodes spike if this not here
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.data = this.reformatEvent(this.dataManagerService.events);
            }, 0);
        }
    }

    ngAfterViewInit(): void {}

    private reformatEvent(events: Event[]): TableEvent[] {
        let formatedEvents = [];
        for (let event of events) {
            formatedEvents.push({
                timestamp: event.timestamp,
                type: event.metadata.type,
                trigger: event.trigger,
                message: event.message
            });
        }
        return formatedEvents;
    }

    private addEvents(events: TableEvent[]) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = [...this.dataSource.data, ...events]; //imutable
        this.table.renderRows();
    }

    private setEvents(events: TableEvent[]) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = events;
        this.table.renderRows();
    }

    showNewEventsOnly() {
        this.dataSource.data = [];
        this.mode = 'New Events';
    }

    showAllEvents() {
        this.dataSource.data = this.reformatEvent(this.dataManagerService.events);
        this.mode = 'All Events';
    }

    applyFilter(event: any) {
        this.dataSource.filter = (<HTMLTextAreaElement>event.target).value.trim().toLowerCase();
    }

    clearFilter() {
        this.dataSource.filter = '';
    }

    setDefaultPageSize(event: any) {
        this.screenItem.options['pageSize'] = event.pageSize;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
