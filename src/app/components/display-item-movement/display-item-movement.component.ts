import { AfterViewInit, Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { faSquare, faArrowUp, faArrowDown, faLock, faCircleArrowUp, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { Motors } from 'src/app/Models/interfaces/Motors';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryBoolean, TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-item-movement',
    templateUrl: './display-item-movement.component.html',
    styleUrls: ['./display-item-movement.component.css']
})
export class DisplayItemMovementComponent implements OnInit, OnDestroy {
    @Input() screenItem: ScreenItem;

    faSquare = faSquare;
    faArrowUp = faArrowUp;
    faArrowDown = faArrowDown;
    faLock = faLock;
    faCircleArrowUp = faCircleArrowUp;

    private ngUnsubscribe = new Subject<void>();

    armed: boolean = true;
    speed: number = 0;
    previousSpeed: number = 0;
    motors: Motors = {
        motorOne: {
            enabled: false,
            forwards: true,
            speed: 0.2
        },
        motorTwo: {
            enabled: false,
            forwards: true,
            speed: 0.2
        },
        motorThree: {
            enabled: false,
            forwards: true,
            speed: 0.2
        },
        motorFour: {
            enabled: false,
            forwards: true,
            speed: 0.2
        }
    };

    constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.dataManagerService.motorOneEnabledSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorOneEnabled(telemetry);
        });
        this.dataManagerService.motorOneForwardsSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorOneForwards(telemetry);
        });
        this.dataManagerService.motorOneSpeedSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorOneSpeed(telemetry);
        });
        this.dataManagerService.motorTwoEnabledSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorTwoEnabled(telemetry);
        });
        this.dataManagerService.motorTwoForwardsSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorTwoForwards(telemetry);
        });
        this.dataManagerService.motorTwoSpeedSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorTwoSpeed(telemetry);
        });
        this.dataManagerService.motorThreeEnabledSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorThreeEnabled(telemetry);
        });
        this.dataManagerService.motorThreeForwardsSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorThreeForwards(telemetry);
        });
        this.dataManagerService.motorThreeSpeedSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorThreeSpeed(telemetry);
        });
        this.dataManagerService.motorFourEnabledSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorFourEnabled(telemetry);
        });
        this.dataManagerService.motorFourForwardsSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorFourForwards(telemetry);
        });
        this.dataManagerService.motorFourSpeedSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateMotorFourSpeed(telemetry);
        });
        this.dataManagerService.movementEnabledSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateArmed(telemetry);
        });
        this.dataManagerService.movementSpeedSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((telemetry) => {
            this.updateSpeed(telemetry);
        });
    }

    ngOnInit(): void {}

    private updateArmed(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.armed = telemetry.value;
        }
    }

    private updateSpeed(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.speed = telemetry.value;
            this.previousSpeed = this.speed;
        }
    }

    private updateMotorOneEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorOne.enabled = telemetry.value;
        }
    }

    private updateMotorOneForwards(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorOne.forwards = telemetry.value;
        }
    }

    private updateMotorOneSpeed(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.motors.motorOne.speed = telemetry.value;
        }
    }

    private updateMotorTwoEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorTwo.enabled = telemetry.value;
        }
    }

    private updateMotorTwoForwards(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorTwo.forwards = telemetry.value;
        }
    }

    private updateMotorTwoSpeed(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.motors.motorTwo.speed = telemetry.value;
        }
    }

    private updateMotorThreeEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorThree.enabled = telemetry.value;
        }
    }

    private updateMotorThreeForwards(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorThree.forwards = telemetry.value;
        }
    }

    private updateMotorThreeSpeed(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.motors.motorThree.speed = telemetry.value;
        }
    }

    private updateMotorFourEnabled(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorFour.enabled = telemetry.value;
        }
    }

    private updateMotorFourForwards(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.motors.motorFour.forwards = telemetry.value;
        }
    }

    private updateMotorFourSpeed(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.motors.motorFour.speed = telemetry.value;
        }
    }

    toggleArmed(): void {
        this.socketService.sendControlFrame({ '2': Number(!this.armed) });
    }

    sendSpeedTelemetry(event: any): void {
        let speed: number = parseFloat(event.target.value);
        if (speed >= 0 && speed <= 1) {
            this.socketService.sendControlFrame({ '1': speed });
        }
        this.speed = this.previousSpeed;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
