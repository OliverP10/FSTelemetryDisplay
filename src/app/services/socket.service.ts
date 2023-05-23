import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AudioService } from './audio.service';
import DataManagerService from './data-manager.service';
import { environment } from 'src/environments/environment';
import { ObjectTelemetry, TelemetryAny } from '../Models/interfaces/Telemetry';
import { forkJoin } from 'rxjs';
import { ObjectEvent, Event } from '../Models/interfaces/Events';
import { LoadingSatus } from '../Models/enumerations/Telemetry';
import { Status } from '../Models/enumerations/Comunication';
import { SettingsService } from './settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectionRoute } from '../Models/interfaces/Settings';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public serverConnected: Status = Status.DISCONECTED;
    public vehicleConnected: Status = Status.DISCONECTED;
    public vehicleWifiConnected: Status = Status.DISCONECTED;
    public vehicleRfConnected: Status = Status.DISCONECTED;

    private TelemetryReady = new Subject<TelemetryAny[]>();
    private EventsReady = new Subject<Event[]>();
    private vehicleConnectionStatus = new Subject<boolean>();
    private vehicleWifiConnectionStatus = new Subject<boolean>();
    private vehicleRfConnectionStatus = new Subject<boolean>();
    public connectionRoute: ConnectionRoute = 'rf';

    private telemetryLoadingSubject = new Subject<LoadingSatus>();
    private eventsLoadingSubject = new Subject<LoadingSatus>();
    private ngUnsubscribe = new Subject<void>();
    private loadLatest: boolean = true;

    constructor(
        private socket: Socket,
        private dataManagerService: DataManagerService,
        private http: HttpClient,
        private audioService: AudioService,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar
    ) {
        this.socket.fromEvent('connect').subscribe(() => this.setServerConnectionStatus(true));
        this.socket.fromEvent('disconnect').subscribe(() => this.setServerConnectionStatus(false));
        this.socket.fromEvent('vehicle-connection').subscribe((data: any) => this.setVehicleConnectionStatus(data));
        this.socket.fromEvent('vehicle-wifi-connection').subscribe((data: any) => this.setVehicleWifiConnectionStatus(data));
        this.socket.fromEvent('vehicle-rf-connection').subscribe((data: any) => this.setVehicleRfConnectionStatus(data));
        this.socket.fromEvent('connecntion-route').subscribe((data: any) => (this.connectionRoute = data));
    }

    public onServerDisconect(): Observable<unknown> {
        return this.socket.fromEvent('disconnect');
    }

    public onServerConnect(): Observable<unknown> {
        return this.socket.fromEvent('connect');
    }

    private setServerConnectionStatus(connected: boolean) {
        if (connected) {
            this.connected();
            this.audioService.playTelemRecoverd();
        }
        if (!connected) {
            this.setVehicleConnectionStatus(false);
            this.audioService.playTelemLost();
        }
        this.serverConnected = connected ? Status.CONNECTED : Status.DISCONECTED;
    }

    public setConnectionRoute(connectionRoute: ConnectionRoute) {
        this.connectionRoute = connectionRoute;
        this.socket.emit('connecntion-route', connectionRoute);
        this.snackBar.open('Rerouting data through ' + connectionRoute, 'Dismiss', {
            duration: 3000
        });
    }

    public getConnectionRoute(): ConnectionRoute {
        return this.connectionRoute;
    }

    private connected() {
        this.socket.emit('setType', 'client');
        if (this.loadLatest) {
            this.loadLatestModel();
        }
    }

    public loadLatestModel() {
        this.loadLatest = true;
        this.stopLiveDataSubscriptions();
        this.startLiveDataSubscriptions();
        this.dataManagerService.clearData();
        this.telemetryLoadingSubject.next(LoadingSatus.LOADING);
        this.eventsLoadingSubject.next(LoadingSatus.LOADING);
        forkJoin({
            latestTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getAllUniqueFromSessionStart'),
            allTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getFromSessionStart')
        }).subscribe({
            next: (data) => {
                let latestTelemetry: TelemetryAny[] = data.latestTelemetry.telemetry;
                this.dataManagerService.fireAllTelemetrySubscriptions(latestTelemetry);

                let allTelemetry: TelemetryAny[] = data.allTelemetry.telemetry;
                this.dataManagerService.mergeTelemetry(allTelemetry);
                this.dataManagerService.findUnqieLabels();
                this.TelemetryReady.next(this.dataManagerService.telemetry);
                this.telemetryLoadingSubject.next(LoadingSatus.LOADED);
            },
            error: (e: HttpErrorResponse) => {}
        });

        let allEventObs = this.http.get<ObjectEvent>(environment.ROOT_URL + environment.API_PORT + '/event/getFromSessionStart');
        allEventObs.subscribe({
            next: (eventObj) => {
                this.dataManagerService.mergeEvents(eventObj.event);
                this.EventsReady.next(this.dataManagerService.events);
                this.eventsLoadingSubject.next(LoadingSatus.LOADED);
            },
            error: (e: HttpErrorResponse) => {}
        });
    }

    public loadCustomModel(from: Date, to: Date) {
        this.loadLatest = false;
        this.stopLiveDataSubscriptions();
        this.dataManagerService.clearData();

        this.telemetryLoadingSubject.next(LoadingSatus.LOADING);
        this.eventsLoadingSubject.next(LoadingSatus.LOADING);
        let customeRangeTelemetry = this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getRange/' + from + '/' + to);
        customeRangeTelemetry.subscribe({
            next: (telemObj) => {
                this.dataManagerService.setTelemetry(telemObj.telemetry);
                this.dataManagerService.findUnqieLabels();
                this.TelemetryReady.next(this.dataManagerService.telemetry);
                this.telemetryLoadingSubject.next(LoadingSatus.LOADED);
            },
            error: (e: HttpErrorResponse) => {}
        });

        let customeRangeEvents = this.http.get<ObjectEvent>(environment.ROOT_URL + environment.API_PORT + '/event/getRange/' + from + '/' + to);
        customeRangeEvents.subscribe({
            next: (eventsObj) => {
                this.dataManagerService.setEvents(eventsObj.event);
                this.EventsReady.next(this.dataManagerService.events);
                this.eventsLoadingSubject.next(LoadingSatus.LOADED);
            },
            error: (e: HttpErrorResponse) => {}
        });
    }

    public getLoadLatest(): boolean {
        return this.loadLatest;
    }

    public startLiveDataSubscriptions() {
        this.socket
            .fromEvent('telemetry')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => this.dataManagerService.addTelemetry(data)); //for guages that only want the most recent
        this.socket
            .fromEvent('events')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => {
                this.dataManagerService.addEvents(data);
            }); //for guages that only want the most recent
        this.socket
            .fromEvent('log')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => {
                //this.appendLogs(data);
            });
    }

    public stopLiveDataSubscriptions() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribe = new Subject<void>();
    }

    public get serverConnectionSatatus(): Status {
        return this.serverConnected;
    }

    public get serverVehicleSatatus(): Status {
        return this.vehicleConnected;
    }

    public get serverVehicleWifiSatatus(): Status {
        return this.vehicleWifiConnected;
    }

    public get serverVehicleRfSatatus(): Status {
        return this.vehicleRfConnected;
    }

    public onTelemetryReady(): Observable<TelemetryAny[]> {
        return this.TelemetryReady.asObservable();
    }

    public onEventsReady(): Observable<Event[]> {
        return this.EventsReady.asObservable();
    }

    public onEventsLoadingSubject(): Observable<LoadingSatus> {
        return this.eventsLoadingSubject.asObservable();
    }

    public onVehicleConnectionStatus(): Observable<boolean> {
        return this.vehicleConnectionStatus.asObservable();
    }

    public onVehicleWifiConnectionStatus(): Observable<boolean> {
        return this.vehicleWifiConnectionStatus.asObservable();
    }

    public onVehicleRfConnectionStatus(): Observable<boolean> {
        return this.vehicleRfConnectionStatus.asObservable();
    }

    public onTelemetryLoadingSubject(): Observable<LoadingSatus> {
        return this.telemetryLoadingSubject.asObservable();
    }

    private setVehicleConnectionStatus(connected: boolean) {
        this.vehicleConnected = connected ? Status.CONNECTED : Status.DISCONECTED;
        this.vehicleConnectionStatus.next(connected);
    }

    private setVehicleWifiConnectionStatus(connected: boolean) {
        this.vehicleWifiConnected = connected ? Status.CONNECTED : Status.DISCONECTED;
        this.vehicleWifiConnectionStatus.next(connected);
    }

    private setVehicleRfConnectionStatus(connected: boolean) {
        this.vehicleRfConnected = connected ? Status.CONNECTED : Status.DISCONECTED;
        this.vehicleRfConnectionStatus.next(connected);
    }

    public sendControlFrame(frame: any): boolean {
        if (this.settingsService.isKeyboardEnabled()) {
            this.socket.emit('control-frame', frame);
            return true;
        } else {
            // this.snackBar.open('Cant send control frame while controls are disabeled', 'Dismiss', {
            //     duration: 3000
            // });
            return false;
        }
    }
}
