import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
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
    armMode: number = 0;
    nextArmMode: number = 2;
    storeBtnStyle: any = {};
    deployBtnStyle: any = {};
    stowBtnStyle: any = {};

    constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
        this.dataManagerService.armStatusSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateArmMode(telemetry);
            });
        this.dataManagerService.armNextStatusSubject
            .asObservable()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                this.updateNextArmMode(telemetry);
            });
    }

    ngOnInit(): void {}

    updateArmMode(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.armMode = telemetry.value;
            this.updateAllBtnStyle();
        }
    }

    updateNextArmMode(telemetry: TelemetryNumber | null) {
        if (telemetry != null) {
            this.nextArmMode = telemetry.value;
            this.updateAllBtnStyle();
        }
    }

    sendArmCommand(command: number): void {
        this.socketService.sendControlFrame({ '6': command });
    }

    updateAllBtnStyle() {
        this.setButtonStyle(this.storeBtnStyle, 0);
        this.setButtonStyle(this.deployBtnStyle, 1);
        this.setButtonStyle(this.stowBtnStyle, 2);
    }

    setButtonStyle(styles: any, button: number) {
        if (this.armMode == button) {
            styles['background-color'] = 'rgb(56, 152, 255)';
        } else {
            styles['background-color'] = 'rgb(255,215,64)';
        }
        if (this.nextArmMode == button) {
            styles['border'] = '2px solid rgb(56, 152, 255)';
        } else {
            styles['border'] = '0px';
        }
        return styles;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
