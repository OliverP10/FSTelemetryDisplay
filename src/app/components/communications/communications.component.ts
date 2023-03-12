import { Component, OnInit, OnDestroy } from '@angular/core';
import { Status } from 'src/app/Models/enumerations/Comunication';
import { SettingsService } from 'src/app/services/settings.service';
import { faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SocketService } from 'src/app/services/socket.service';
import { Subject, takeUntil } from 'rxjs';
import { leftToRightGrow } from 'src/app/animations/animations';

@Component({
    selector: 'app-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css'],
    animations: [leftToRightGrow]
})
export class CommunicationsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject<void>();

    faQuestion = faQuestion;
    faXmark = faXmark;

    //RENAME WIFI AND RF TO PRIMARY AND SECONDARY
    //ALSO FIX AND REALIGN THE X AND ?

    wifiToRover: Status = Status.DISCONECTED;
    rfToRover: Status = Status.DISCONECTED;
    wifiToServer: Status = Status.DISCONECTED;
    rfToServer: Status = Status.DISCONECTED;
    clientToServer: Status = Status.DISCONECTED;

    constructor(private settingsService: SettingsService, private socketService: SocketService) {
        this.settingsService.setTitle('Communications');
        this.settingsService.setHeaderItems(['connectionRoute']);
        this.socketService
            .onServerDisconect()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.setCurrentState();
            });
        this.socketService
            .onServerConnect()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.setCurrentState();
            });
        this.socketService
            .onVehicleWifiConnectionStatus()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((connected) => {
                this.setCurrentState();
            });
        this.socketService
            .onVehicleRfConnectionStatus()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((connected) => {
                this.setCurrentState();
            });
    }

    ngOnInit(): void {
        this.setCurrentState();
    }

    private setCurrentState() {
        this.wifiToRover = this.socketService.vehicleWifiConnected;
        this.wifiToServer = this.socketService.vehicleWifiConnected;
        this.rfToRover = this.socketService.vehicleRfConnected;
        this.rfToServer = this.socketService.vehicleRfConnected;
        this.setServerState();
    }

    private setServerState() {
        if (this.socketService.serverConnected) {
            this.clientToServer = Status.CONNECTED;
        } else {
            this.wifiToRover = Status.UNKNOWN;
            this.rfToRover = Status.UNKNOWN;
            this.wifiToServer = Status.UNKNOWN;
            this.rfToServer = Status.UNKNOWN;
            this.clientToServer = Status.DISCONECTED;
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
