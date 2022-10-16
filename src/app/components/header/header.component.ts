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

    connectionColor: string;
    vehicleConnectionColor: string = 'red';
    arduinoConnectionColor: string = '#30ad1a';
    arduinoConnectionIcon: any = faPlug;

    warningColor: string;
    volumeIcon: any = faVolumeMute;

    showAddDisplay: boolean = false;
    mute: boolean = true;

    constructor(
        private dialogRef: MatDialog,
        private settingsService: SettingsService,
        private socketService: SocketService,
        private dataManager: DataManagerService,
        private audioService: AudioService
    ) {
        this.socketService.onServerConnect().subscribe(() => this.setConnectionStatus(true));
        this.socketService.onServerDisconect().subscribe(() => this.setConnectionStatus(false));
        //this.socketService.onCurrentWarnings().subscribe((show: Boolean) => this.setWarningStatus(show));
        this.dataManager.onArduinoConnected().subscribe((telemetry) => this.setArduinoConnectionStatus(telemetry));
        this.socketService.onVehicleConnectionStatus().subscribe((connected: any) => this.setVehicleConnectionStatus(connected));
    }

    ngOnInit(): void {
        this.setConnectionStatus(this.socketService.serverConnectionSatatus);
    }

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

    setWarningStatus(show: Boolean) {
        this.warningColor = show ? 'yellow' : 'rgb(62, 71, 90)';
    }

    setVehicleConnectionStatus(connected: boolean) {
        this.vehicleConnectionColor = connected ? '#30ad1a' : 'red';
    }

    setArduinoConnectionStatus(telemetry: TelemetryBoolean | null) {
        if (telemetry != null) {
            this.arduinoConnectionIcon = telemetry.value ? faPlug : faPlugCircleXmark;
            this.arduinoConnectionColor = telemetry.value ? '#30ad1a' : 'red';
        } else {
            this.arduinoConnectionIcon = faPlugCircleXmark;
            this.arduinoConnectionColor = 'yellow';
        }
    }

    setConnectionStatus(connected: boolean) {
        this.connectionColor = connected ? '#30ad1a' : 'red';

        //as when lose of conection cant tell if arduino is connected
        this.arduinoConnectionIcon = connected ? faPlug : faPlugCircleXmark;
        this.arduinoConnectionColor = connected ? '#30ad1a' : 'red';

        this.vehicleConnectionColor = 'red';
    }
}
