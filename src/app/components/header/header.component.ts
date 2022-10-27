import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { faPlus, faBars, faServer, faTriangleExclamation, faVolumeHigh, faVolumeMute, faPlug, faPlugCircleXmark, faFloppyDisk, faDownload, faTruckMonster } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { Display } from 'src/app/interfaces/Display';
import { SettingsService } from 'src/app/services/settings.service';
import { SocketService } from 'src/app/services/socket.service';
import { AudioService } from 'src/app/services/audio.service';
import { environment } from 'src/environments/environment';
import { DataManagerService } from 'src/app/services/data-manager.service';
import { Subject, takeUntil } from 'rxjs';
import { TelemetryBoolean } from 'src/app/interfaces/Telemetry';

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

    volumeIcon: any = faVolumeMute;

    showAddDisplay: boolean = false;
    mute: boolean = true;

    constructor(public settingsService: SettingsService, public socketService: SocketService, private audioService: AudioService) {}

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
        this.mute = !this.mute;
        this.volumeIcon = this.mute ? this.faVolumeMute : this.faVolumeHigh;
        this.audioService.setMute(this.mute);
    }

    setWarningStatus(show: Boolean) {}
}
