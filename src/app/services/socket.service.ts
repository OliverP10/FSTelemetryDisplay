import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { Observable, Subject } from 'rxjs';
import { ErrorData, ROVER_MODE } from '../Display';
import { AudioService } from './audio.service';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private allDataSubject = new Subject<any>();
	private liveDataSubject = new Subject<any>();
	
	private currentWarningsSubject = new Subject<any>();
	private warningsSubject = new Subject<any>();
	private logsSubject = new Subject<any>();

	data:any
	logs:string[] = []

	serverConnected:boolean = false;
	arduinoConnected:boolean = true;
	vehicleConnected:boolean = false;
	errors:ErrorData[] = []
	
	currentWarnings: Boolean = false;

	constructor(private socket: Socket, private audio: AudioService) { 
		this.socket.fromEvent('all-data').subscribe((data: any) => this.loadData(data))	//for graphs that want all data
		this.socket.fromEvent('live-data').subscribe((data: any) => this.appendLiveData(data));	//for guages that only want the most recent
		this.socket.fromEvent('connect').subscribe(() => this.setConnectionStatus(true));
    	this.socket.fromEvent('disconnect').subscribe(() => this.setConnectionStatus(false));
		this.socket.fromEvent('serial-port').subscribe((data: any) => this.setArduinoConnectionStatus(data));
		this.socket.fromEvent('vehicle-connection').subscribe((data: any) => this.setVehicleConnectionStatus(data));
		this.socket.fromEvent('log').subscribe((data: any) => {this.appendLogs(data)});
		
	}

	loadData(_data:any) {
		this.data = _data
		this.allDataSubject.next(this.data);
		
	}

	onNewData() {
		return this.allDataSubject.asObservable();
	}

	onLiveData() {
		return this.liveDataSubject.asObservable()
	}

	requestAllData() {
		this.socket.emit('all-data');
	}

	onDisconect() {
		return this.socket.fromEvent('disconnect');
	}

	onConnect() {
		return this.socket.fromEvent('connect');
	}

	setConnectionStatus(connected:boolean) {
		if(connected) {
			this.socket.emit("setType", "client")
			this.socket.emit("all-data")
		}
		(connected) ? this.audio.playSound("telemRecovered") : this.audio.playSound("telemLost")
		this.serverConnected = connected;
	}

	onArduinoConnectionStatus() {
		return this.socket.fromEvent("serial-port")
	}

	setArduinoConnectionStatus(connected:boolean) {
		if(!connected) {
			this.audio.playSound("arduinoFail")
		}
		this.arduinoConnected = connected
	}

	onVehicleConnectionStatus() {
		return this.socket.fromEvent("vehicle-connection")
	}

	setVehicleConnectionStatus(connected:boolean) {
		this.vehicleConnected = connected
	}

	getConnectionSatatus():boolean {
		return this.serverConnected;
	}

	onCurrentWarnings() {
		return this.currentWarningsSubject.asObservable();
	}

	onWarnings() {
		return this.warningsSubject.asObservable();
	}

	appendLogs(data:any) {
		this.logs.push(data)
		this.logsSubject.next(data)
	}

	onLogs() {
		return this.logsSubject.asObservable();
	}

	sendKeyFrame(key:string) {
		this.socket.emit("key-frame", key)
	}

	sendControlFrame(frame: any) {
		this.socket.emit("control-frame", frame)
	}

	private appendLiveData(_liveData:any) {
		let timeLength = this.data["time_stamp"]?.length || 0
		for(let key in _liveData) {
			if(this.data.hasOwnProperty(key)){
			  	this.data[key].push(_liveData[key]);
			} else {
				this.data[key] = Array(timeLength).fill(0)
				this.data[key].push(_liveData[key]);
			}
		}
		this.allDataSubject.next(this.data);
		this.liveDataSubject.next(_liveData);
		this.checkErrors(_liveData.errors);
	}

	private checkErrors(errors:ErrorData[]) {
		this.currentWarningsSubject.next((errors.length==0) ? false : true);
		
		for(let error of errors) {		//loop through errors	
			if(!this.updateErrors(error)) {	//if there are errors then
				this.errors.push(error);
				this.warningsSubject.next(this.errors);
				(this.audio.isAudioPlaying()) ? this.audio.playSound("multiSenseError"): this.audio.playSound(error.type)
			}
		}
	}

	private updateErrors(error:ErrorData) {
		for(let i=0;i<this.errors.length;i++) {		//if error in errors then update it, else add it
			if ((this.errors[i].dataLabel == error.dataLabel) && (this.errors[i].type == error.type)) {
				this.errors[i]=error
				this.warningsSubject.next(this.errors);
				return true
			}
		}
		return false;
	}
}