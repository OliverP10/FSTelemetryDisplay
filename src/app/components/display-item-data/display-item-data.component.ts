import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-item-data',
    templateUrl: './display-item-data.component.html',
    styleUrls: ['./display-item-data.component.css']
})
export class DisplayItemDataComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;

    private ngUnsubscribe = new Subject<void>();

    jsonText: string;

    constructor(private dataManagerService: DataManagerService) {
        this.dataManagerService
            .onTelemetry()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.jsonText = JSON.stringify(telemetry, null, '\t').trim();
            });
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
