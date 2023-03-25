import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { MatTable } from '@angular/material/table';
import { faMinus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ErrorData, Display } from 'src/app/Models/interfaces/Display';
import DataManagerService from 'src/app/services/data-manager.service';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { Event } from 'src/app/Models/interfaces/Events';

@Component({
    selector: 'app-display-item-warnings',
    templateUrl: './display-item-warnings.component.html',
    styleUrls: ['./display-item-warnings.component.css']
})
export class DisplayItemWarningsComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;
    @ViewChild(MatTable) table: MatTable<Event[]>;

    private ngUnsubscribe = new Subject<void>();

    faMinus = faMinus;
    faTriangleExclamation = faTriangleExclamation;

    errorDataColumns: string[];

    constructor(public dataManagerService: DataManagerService, private settingsService: SettingsService) {
        this.dataManagerService
            .onEvents()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((event) => this.updateEvents(event));

        this.errorDataColumns = ['symbol', 'dataLabel', 'type', 'error', 'btnRemove'];
    }

    ngOnInit(): void {}

    updateEvents(events: Event[]) {
        this.table.renderRows();
    }

    removeError(event: Event) {
        // this.dataManagerService.events = this.dataManagerService.events.filter((e) => e.dataLabel != error.dataLabel || e.type != error.type);
        // this.table.renderRows();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
