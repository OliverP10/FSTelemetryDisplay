import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { AudioService } from './audio.service';
import { DataManagerService } from './data-manager.service';
import { environment } from 'src/environments/environment';
import { ObjectTelemetry, TelemetryAny } from '../interfaces/Telemetry';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public serverConnected: boolean = false;
    public vehicleConnected: boolean = false;

    private dataReady = new Subject<TelemetryAny[]>();
    private vehicleConnectionStatus = new Subject<boolean>();

    constructor(private socket: Socket, private dataManager: DataManagerService, private http: HttpClient, private audio: AudioService) {
        this.socket.fromEvent('telemetry').subscribe((data: any) => this.dataManager.addTelemetry(data)); //for guages that only want the most recent
        this.socket.fromEvent('events').subscribe((data: any) => this.dataManager.addEvents(data)); //for guages that only want the most recent
        this.socket.fromEvent('connect').subscribe(() => this.setServerConnectionStatus(true));
        this.socket.fromEvent('disconnect').subscribe(() => this.setServerConnectionStatus(false));
        this.socket.fromEvent('vehicle-connection').subscribe((data: any) => this.setVehicleConnectionStatus(data));
        this.socket.fromEvent('log').subscribe((data: any) => {
            //this.appendLogs(data);
        });
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

        forkJoin({
            latestTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getAllUniqueFromSessionStart'),
            allTelemetry: this.http.get<ObjectTelemetry>(environment.ROOT_URL + environment.API_PORT + '/telemetry/getFromSessionStart')
        }).subscribe((data: any) => {
            let latestTelemetry: TelemetryAny[] = data.latestTelemetry.telemetry;
            this.dataManager.fireAllTelemetrySubscriptions(latestTelemetry);
            let allTelemetry: TelemetryAny[] = data.allTelemetry.telemetry;
            this.dataManager.mergeTelemetry(allTelemetry);
            this.dataReady.next(this.dataManager.telemetry);
        });
    }

    public get serverConnectionSatatus(): boolean {
        return this.serverConnected;
    }

    public onDataReady(): Observable<TelemetryAny[]> {
        return this.dataReady.asObservable();
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
