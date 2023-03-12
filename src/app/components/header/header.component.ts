import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
    faPlus,
    faBars,
    faServer,
    faTriangleExclamation,
    faVolumeHigh,
    faVolumeMute,
    faPlug,
    faPlugCircleXmark,
    faFloppyDisk,
    faDownload,
    faTruckMonster,
    faKeyboard,
    faWifi,
    faTowerBroadcast
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { Display } from 'src/app/Models/interfaces/Display';
import { SettingsService } from 'src/app/services/settings.service';
import { SocketService } from 'src/app/services/socket.service';
import { AudioService } from 'src/app/services/audio.service';
import { environment } from 'src/environments/environment';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { Subject, takeUntil } from 'rxjs';
import { TelemetryBoolean } from 'src/app/Models/interfaces/Telemetry';
import { WarningService } from 'src/app/services/warning.service';
import { MasterWarningState, WarningState } from 'src/app/Models/enumerations/Warning';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    private ngUnsubscribe = new Subject<void>();
    readonly URL = environment.ROOT_URL + environment.API_PORT;

    faPlus = faPlus;
    faBars = faBars;
    faServer = faServer;
    faTriangleExclamation = faTriangleExclamation;
    faVolumeHigh = faVolumeHigh;
    faVolumeMute = faVolumeMute;
    faPlug = faPlug;
    faPlugCircleXmark = faPlugCircleXmark;
    faFloppyDisk = faFloppyDisk;
    faDownload = faDownload;
    faTruckMonster = faTruckMonster;
    faKeyboard = faKeyboard;
    faWifi = faWifi;
    faTowerBroadcast = faTowerBroadcast;

    showAddDisplay: boolean = false;
    warningDefaultColor = 'rgb(67, 79, 95)';
    warningStateOn = WarningState.ON;

    masterWarningColor: string = this.warningDefaultColor;
    masterWarningIterval: any;
    masterWarningFlash: boolean = true;

    constructor(public settingsService: SettingsService, public socketService: SocketService, public audioService: AudioService, public warningService: WarningService) {
        this.warningService
            .onMasterWarningState()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((state) => {
                this.setMasterWarningState(state);
            });
    }

    ngOnInit(): void {}

    toggleAddDisplay(): void {
        this.settingsService.toggleAddDisplay();
    }

    toggleSidebar() {
        this.settingsService.toggleSidebar();
    }

    saveScreen() {
        this.settingsService.saveScreens();
    }

    downloadLogs() {
        const link = document.createElement('a');

        link.setAttribute('href', this.URL + '/logs');
        link.setAttribute('download', 'server_session_logs.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    toggleMute() {
        this.audioService.toggleMute();
    }

    acknoledgeMasterWarning() {
        this.warningService.acknoldegeMasterWarning();
    }

    setMasterWarningState(state: MasterWarningState) {
        switch (state) {
            case MasterWarningState.OFF:
                clearInterval(this.masterWarningIterval);
                this.masterWarningColor = this.warningDefaultColor;
                break;
            case MasterWarningState.SILENCED:
                clearInterval(this.masterWarningIterval);
                this.masterWarningColor = 'red';
                break;
            case MasterWarningState.ON:
                this.flashMasterWarning();
                break;
        }
    }

    flashMasterWarning() {
        clearInterval(this.masterWarningIterval);
        this.masterWarningIterval = setInterval(() => {
            if (this.masterWarningFlash) {
                this.masterWarningFlash = false;
                this.masterWarningColor = 'red';
            } else {
                this.masterWarningFlash = true;
                this.masterWarningColor = this.warningDefaultColor;
            }
        }, 500);
    }
}
