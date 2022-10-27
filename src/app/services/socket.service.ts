import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AudioService } from './audio.service';
import { DataManagerService } from './data-manager.service';
import { environment } from 'src/environments/environment';
import { ObjectTelemetry, TelemetryAny } from '../interfaces/Telemetry';
import { forkJoin } from 'rxjs';
import { ObjectEvent, Event } from '../interfaces/Events';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public serverConnected: boolean = false;
    public vehicleConnected: boolean = false;

    private TelemetryReady = new Subject<TelemetryAny[]>();
    private EventsReady = new Subject<Event[]>();
    private vehicleConnectionStatus = new Subject<boolean>();

    private ngUnsubscribe = new Subject<void>();
    private loadLatest: boolean = true;

    constructor(private socket: Socket, private dataManagerService: DataManagerService, private http: HttpClient, private audio: AudioService) {
        this.socket.fromEvent('connect').subscribe(() => this.setServerConnectionStatus(true));
        this.socket.fromEvent('disconnect').subscribe(() => this.setServerConnectionStatus(false));
        this.socket.fromEvent('vehicle-connection').subscribe((data: any) => this.setVehicleConnectionStatus(data));
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
        }
        if (!connected) {
            this.setVehicleConnectionStatus(false);
        }
        connected ? this.audio.playSound('telemRecovered') : this.audio.playSound('telemLost');
        this.serverConnected = connected;
    }

    private connected() {
        this.socket.emit('setType', 'client');
        if (this.loadLatest) {
            this.loadLatestModel();
        }
    }

    public loadLatestModel() {
        this.loadLatest = true;
        this.startLiveDataSubscriptions();
        this.dataManagerService.clearData();
        forkJoin({
            latestTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getAllUniqueFromSessionStart'),
            allTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getFromSessionStart')
        }).subscribe((data: any) => {
            let latestTelemetry: TelemetryAny[] = data.latestTelemetry.telemetry;
            this.dataManagerService.fireAllTelemetrySubscriptions(latestTelemetry);

            let allTelemetry: TelemetryAny[] = data.allTelemetry.telemetry;
            this.dataManagerService.mergeTelemetry(allTelemetry);
            this.TelemetryReady.next(this.dataManagerService.telemetry);
        });

        let allEventObs = this.http.get<ObjectEvent>(environment.ROOT_URL + environment.API_PORT + '/event/getFromSessionStart');
        allEventObs.subscribe((eventObj) => {
            this.dataManagerService.mergeEvents(eventObj.event);
            this.EventsReady.next(this.dataManagerService.events);
        });
    }

    public loadCustomModel() {
        if (this.loadLatest == false) {
            return;
        }
        this.loadLatest = false;
        this.stopLiveDataSubscriptions();
        this.dataManagerService.clearData();
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
            .subscribe((data: any) => this.dataManagerService.addEvents(data)); //for guages that only want the most recent
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
    }

    public get serverConnectionSatatus(): boolean {
        return this.serverConnected;
    }

    public get serverVehicleSatatus(): boolean {
        return this.vehicleConnected;
    }

    public onTelemetryReady(): Observable<TelemetryAny[]> {
        return this.TelemetryReady.asObservable();
    }

    public onEventsReady(): Observable<Event[]> {
        return this.EventsReady.asObservable();
    }

    public onVehicleConnectionStatus(): Observable<boolean> {
        return this.vehicleConnectionStatus.asObservable();
    }

    private setVehicleConnectionStatus(connected: boolean) {
        this.vehicleConnected = connected;
        this.vehicleConnectionStatus.next(connected);
    }

    public sendKeyFrame(key: string) {
        this.socket.emit('key-frame', key);
    }

    public sendControlFrame(frame: any) {
        this.socket.emit('control-frame', frame);
    }
}
