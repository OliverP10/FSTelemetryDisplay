import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { SocketService } from 'src/app/services/socket.service';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import DataManagerService from 'src/app/services/data-manager.service';
import { TelemetryBoolean, TelemetryString } from 'src/app/Models/interfaces/Telemetry';

@Component({
    selector: 'app-display-item-claw',
    templateUrl: './display-item-claw.component.html',
    styleUrls: ['./display-item-claw.component.css']
})
export class DisplayItemClawComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;

    faMaximize = faMaximize;
    faMinimize = faMinimize;

    armed: boolean = false;
    state: string = 'neutral';

    private ngUnsubscribe = new Subject<void>();

    constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.dataManagerService.clawStatusSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateClawStatus(telemetry);
            });
        this.dataManagerService.armEnabledSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateClawEnabled(telemetry);
            });
    }

    ngOnInit(): void {}

    private updateClawStatus(telemetry: TelemetryString | null) {
        if (telemetry != null) {
            this.state = telemetry.value;
        }
    }

    private updateClawEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.armed = telemetry.value;
        }
    }

    toggleArmed(): void {
        this.armed = !this.armed;
        this.socketService.sendControlFrame({ claw_armed: this.armed });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
