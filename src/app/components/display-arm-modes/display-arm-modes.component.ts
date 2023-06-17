import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-arm-modes',
    templateUrl: './display-arm-modes.component.html',
    styleUrls: ['./display-arm-modes.component.css']
})
export class DisplayItemArmModesComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;

    private ngUnsubscribe = new Subject<void>();

    constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.dataManagerService.armStatusSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {});
        this.dataManagerService.armNextStatusSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {});
    }

    ngOnInit(): void {}

    sendArmCommand(command: number): void {
        this.socketService.sendControlFrame({ '6': command });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
