import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Display } from 'src/app/Models/interfaces/Display';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject, takeUntil } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import DataManagerService from 'src/app/services/data-manager.service';
import { TelemetryBoolean, TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
import { Arm } from 'src/app/Models/interfaces/Arm';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';

@Component({
    selector: 'app-display-arm',
    templateUrl: './display-arm.component.html',
    styleUrls: ['./display-arm.component.css']
})
export class DisplayItemArmComponent implements OnInit, OnDestroy {
    @ViewChild('container') containerElement: ElementRef;
    @Input() screenItem: ScreenItem;

    private ngUnsubscribe = new Subject<void>();

    faLock = faLock;
    faLockOpen = faLockOpen;

    styleObj = { width: '400' };
    armControlsEnabled: boolean = true;
    armed: boolean = false;
    manualOverride: boolean = false;

    arm: Arm = {
        yaw: {
            value: 0,
            min: 0,
            max: 270
        },
        pitch1: {
            value: 0,
            min: 0,
            max: 180
        },
        pitch2: {
            value: 0,
            min: 0,
            max: 180
        },
        claw: {
            value: 0,
            min: 0,
            max: 180
        }
    };

    constructor(private settingService: SettingsService, private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.settingService
            .onResizeEvent()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => this.resizeSlider());
        this.dataManagerService.armEnabledSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmEnabled(telemetry);
            });
        this.dataManagerService.armManuleOveridedSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmManuleOverideEnabled(telemetry);
            });
        this.dataManagerService.yawSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmYaw(telemetry);
            });
        this.dataManagerService.armPitch1Subject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmPitch1(telemetry);
            });
        this.dataManagerService.armPitch2Subject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmPitch2(telemetry);
            });
        this.dataManagerService.armClawSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmClaw(telemetry);
            });
    }

    ngOnInit(): void {}

    private updateArmEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.armed = telemetry.value;
        }
    }

    private updateArmManuleOverideEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.manualOverride = telemetry.value;
        }
    }

    private updateArmYaw(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.arm.yaw.value = telemetry.value;
        }
    }

    private updateArmPitch1(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.arm.pitch1.value = telemetry.value;
        }
    }

    private updateArmPitch2(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.arm.pitch2.value = telemetry.value;
        }
    }

    private updateArmClaw(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.arm.claw.value = telemetry.value;
        }
    }

    change(event: any): any {
        return event.value;
    }

    update(): void {
        //do validation on inputs when they are known
        if (this.armControlsEnabled) {
            let values: any = {};
            for (let key in this.arm) {
                values['arm_' + key] = this.arm[key as keyof typeof this.arm].value;
            }
            this.socketService.sendControlFrame(values);
        }
    }

    toggleArmed(): void {
        this.armed = !this.armed;
        this.socketService.sendControlFrame({ arm_armed: this.armed });
    }

    toggleManualOverride(): void {
        this.manualOverride = !this.manualOverride;
        this.socketService.sendControlFrame({ arm_override: this.manualOverride });
    }

    resizeSlider(): void {
        this.styleObj['width'] = this.containerElement.nativeElement.offsetWidth - 200 + 'px';
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
