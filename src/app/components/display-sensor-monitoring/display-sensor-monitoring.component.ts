import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryBoolean, TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-display-sensor-monitoring',
    templateUrl: './display-sensor-monitoring.component.html',
    styleUrls: ['./display-sensor-monitoring.component.css']
})
export class DisplaySensorMonitoringComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;
    faCircleExclamation = faCircleExclamation;

    private ngUnsubscribe = new Subject<void>();
    armed: boolean = false;
    showWarning: boolean = false;
    showWarningTimeout: any;
    warningTrigger: string = '';
    onStart: boolean = true;

    constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.dataManagerService.stompEnabledSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateSensorMonitoringEnabled(telemetry);
            });

        this.dataManagerService.stompEventSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.showWarningIcon(telemetry);
            });
    }

    ngOnInit(): void {}

    toggleArmed(): void {
        this.socketService.sendControlFrame({ '13': Number(!this.armed) });
    }

    showWarningIcon(telemetry: TelemetryNumber | null): void {
        if (telemetry == null) return;
        if (this.onStart) {
            this.onStart = false;
            return;
        }

        this.showWarning = true;
        this.warningTrigger = telemetry.value.toString();
        clearTimeout(this.showWarningTimeout);
        this.showWarningTimeout = setTimeout(() => {
            this.showWarning = false;
            this.warningTrigger = '';
        }, 10000);
    }

    private updateSensorMonitoringEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.armed = telemetry.value;
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
