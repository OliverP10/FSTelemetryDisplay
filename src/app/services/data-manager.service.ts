import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Event } from '../Models/interfaces/Events';
import { TelemetryAny, TelemetryBoolean, TelemetryLocation, TelemetryNumber, TelemetryString } from '../Models/interfaces/Telemetry';
import { AudioService } from './audio.service';
import { WarningService } from './warning.service';

@Injectable({
    providedIn: 'root'
})
export class DataManagerService {
    private telemetrySubject = new Subject<TelemetryAny>();
    private eventSubject = new Subject<Event[]>();
    private logsSubject = new Subject<string>();

    public telemetry: TelemetryAny[] = [];
    public events: Event[] = [];
    public logs: string[] = [];

    private telemetryReady = false;
    private eventsReady = false;
    private uniqueLabels: string[] = [];

    public telemetrySubjects = new Map<string, BehaviorSubject<TelemetryAny | null>>();

    // Gyro
    private rollSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private pitchSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private yawSubject = new BehaviorSubject<TelemetryNumber | null>(null);

    // Other
    private arduinoConnectedSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private locationSubject = new BehaviorSubject<TelemetryLocation | null>(null);

    // Arm
    private armEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private armManuleOveridedSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private armYawSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private armPitch1Subject = new BehaviorSubject<TelemetryNumber | null>(null);
    private armPitch2Subject = new BehaviorSubject<TelemetryNumber | null>(null);
    private armClawSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private clawStatusSubject = new BehaviorSubject<TelemetryString | null>(null);
    private clawEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);

    // Movement
    private movementEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private movementSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private motorOneEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorOneForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorOneSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private motorTwoEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorTwoForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorTwoSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private motorThreeEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorThreeForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorThreeSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    private motorFourEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorFourForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    private motorFourSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);

    constructor(private warningService: WarningService) {
        this.telemetrySubjects.set('ROLL', this.rollSubject);
        this.telemetrySubjects.set('PITCH', this.pitchSubject);
        this.telemetrySubjects.set('YAW', this.yawSubject);
        this.telemetrySubjects.set('ARDUINO_CONNECTED', this.arduinoConnectedSubject);
        this.telemetrySubjects.set('location', this.locationSubject);
        this.telemetrySubjects.set('ARM_ENABLED', this.armEnabledSubject);
        this.telemetrySubjects.set('ARM_YAW', this.armYawSubject);
        this.telemetrySubjects.set('ARM_PITCH_1', this.armPitch1Subject);
        this.telemetrySubjects.set('ARM_PITCH_2', this.armPitch2Subject);
        this.telemetrySubjects.set('ARM_CLAW', this.armClawSubject);
        this.telemetrySubjects.set('CLAW_STATUS', this.clawStatusSubject);
        this.telemetrySubjects.set('CLAW_ENABLED', this.clawEnabledSubject);
        this.telemetrySubjects.set('MOVEMENT_ENABLED', this.movementEnabledSubject);
        this.telemetrySubjects.set('MOVEMENT_SPEED', this.movementSpeedSubject);
        this.telemetrySubjects.set('MOTOR_ONE_ENABLED', this.motorOneEnabledSubject);
        this.telemetrySubjects.set('MOTOR_ONE_FORWARD', this.motorOneForwardsSubject);
        this.telemetrySubjects.set('MOTOR_ONE_SPEED', this.motorOneSpeedSubject);
        this.telemetrySubjects.set('MOTOR_TWO_ENABLED', this.motorTwoEnabledSubject);
        this.telemetrySubjects.set('MOTOR_TWO_FORWARD', this.motorTwoForwardsSubject);
        this.telemetrySubjects.set('MOTOR_TWO_SPEED', this.motorTwoSpeedSubject);
        this.telemetrySubjects.set('MOTOR_THREE_ENABLED', this.motorThreeEnabledSubject);
        this.telemetrySubjects.set('MOTOR_THREE_FORWARD', this.motorThreeForwardsSubject);
        this.telemetrySubjects.set('MOTOR_THREE_SPEED', this.motorThreeSpeedSubject);
        this.telemetrySubjects.set('MOTOR_FOUR_ENABLED', this.motorFourEnabledSubject);
        this.telemetrySubjects.set('MOTOR_FOUR_FORWARD', this.motorFourForwardsSubject);
        this.telemetrySubjects.set('MOTOR_FOUR_SPEED', this.motorFourSpeedSubject);
    }

    public getTelemetryReady(): boolean {
        return this.telemetryReady;
    }

    public getEventsReady(): boolean {
        return this.eventsReady;
    }

    public onTelemetry(): Observable<TelemetryAny> {
        return this.telemetrySubject.asObservable();
    }

    public onEvents(): Observable<Event[]> {
        return this.eventSubject.asObservable();
    }

    public onLogs(): Observable<string> {
        return this.logsSubject.asObservable();
    }

    public clearData() {
        this.telemetry = [];
        this.events = [];
        this.logs = [];
    }

    public findUnqieLabels() {
        let uniqueLabels = new Set<string>();
        for (let telemetry of this.telemetry) {
            uniqueLabels.add(telemetry.metadata.label);
        }
        this.uniqueLabels = Array.from(uniqueLabels);
    }

    public getUniqueLables(): string[] {
        return this.uniqueLabels;
    }

    public appendLogs(data: string) {
        this.logs.push(data);
        this.logsSubject.next(data);
    }

    public addTelemetry(telemetry: TelemetryAny[]) {
        for (let telem of telemetry) {
            telem.timestamp = new Date(telem.timestamp);
            this.telemetry.push(telem);
            this.telemetrySubject.next(telem);
            this.decodeTelemetry(telem);
        }
    }

    public addEvents(events: Event[]) {
        for (let event of events) {
            this.events.push(event);
            this.warningService.decodeEvent(event);
        }
        this.eventSubject.next(events);
    }

    public setTelemetry(telemetry: TelemetryAny[]) {
        this.telemetry = this.applyDates(telemetry);
    }

    public mergeTelemetry(telemetry: TelemetryAny[]) {
        let tempTelemetry = [...this.telemetry];
        this.telemetry = telemetry;
        this.telemetry = this.applyDates(telemetry);
        for (let telem of tempTelemetry) {
            if (!this.telemetry.includes(telem)) {
                this.telemetry.push(telem);
                console.log('Telem mergerd');
            } else {
                console.log('duplicate');
                console.log(telem);
            }
        }
        this.telemetryReady = true;
    }

    public setEvents(events: Event[]) {
        this.events = events;
    }

    public mergeEvents(events: Event[]) {
        let tempEvents = [...this.events];
        this.events = events;
        for (let event of tempEvents) {
            if (!this.events.includes(event)) {
                this.events.push(event);
                console.log('Events mergerd');
            }
        }
        this.eventsReady = true;
    }

    applyDates(telemetry: TelemetryAny[]) {
        for (let index = 0; index < telemetry.length; index++) {
            telemetry[index].timestamp = new Date(telemetry[index].timestamp);
        }
        return telemetry;
    }

    public fireAllTelemetrySubscriptions(telemetry: TelemetryAny[]) {
        telemetry = this.applyDates(telemetry);
        for (let telem of telemetry) {
            this.decodeTelemetry(telem);
        }
    }

    private decodeTelemetry(telemetry: TelemetryAny) {
        switch (telemetry.metadata.label) {
            case 'ROLL':
                this.rollSubject.next(telemetry);
                break;
            case 'PITCH':
                this.pitchSubject.next(telemetry);
                break;
            case 'YAW':
                this.yawSubject.next(telemetry);
                break;
            case 'location':
                this.locationSubject.next(telemetry);
                break;
            case 'ARM_ENABLED':
                this.armEnabledSubject.next(telemetry);
                break;
            case 'ARM_YAW':
                this.armYawSubject.next(telemetry);
                break;
            case 'ARM_PITCH_1':
                this.armPitch1Subject.next(telemetry);
                break;
            case 'ARM_PITCH_2':
                this.armPitch2Subject.next(telemetry);
                break;
            case 'ARM_CLAW':
                this.armClawSubject.next(telemetry);
                break;
            case 'CLAW_ENABLED':
                this.clawEnabledSubject.next(telemetry);
                break;
            case 'MOVEMENT_ENABLED':
                this.movementEnabledSubject.next(telemetry);
                break;
            case 'MOVEMENT_SPEED':
                this.movementSpeedSubject.next(telemetry);
                break;
            case 'MOTOR_ONE_ENABLED':
                this.motorOneEnabledSubject.next(telemetry);
                break;
            case 'MOTOR_ONE_FORWARD':
                this.motorOneForwardsSubject.next(telemetry);
                break;
            case 'MOTOR_ONE_SPEED':
                this.motorOneSpeedSubject.next(telemetry);
                break;
            case 'MOTOR_TWO_ENABLED':
                this.motorTwoEnabledSubject.next(telemetry);
                break;
            case 'MOTOR_TWO_FORWARD':
                this.armEnabledSubject.next(telemetry);
                break;
            case 'MOTOR_TWO_SPEED':
                this.motorTwoSpeedSubject.next(telemetry);
                break;
            case 'MOTOR_THREE_ENABLED':
                this.motorThreeEnabledSubject.next(telemetry);
                break;
            case 'MOTOR_THREE_FORWARD':
                this.motorThreeForwardsSubject.next(telemetry);
                break;
            case 'MOTOR_THREE_SPEED':
                this.motorThreeSpeedSubject.next(telemetry);
                break;
            case 'MOTOR_FOUR_ENABLED':
                this.motorFourEnabledSubject.next(telemetry);
                break;
            case 'MOTOR_FOUR_FORWARD':
                this.motorFourForwardsSubject.next(telemetry);
                break;
            case 'MOTOR_FOUR_SPEED':
                this.motorFourSpeedSubject.next(telemetry);
                break;
            default:
                console.error('No matching telemetry found for: ' + telemetry.metadata.label);
        }
    }

    public onCustomTelemetry(label: string): Observable<TelemetryAny | null> {
        return this.telemetrySubjects.get(label)!.asObservable();
    }

    public onCustomTelemetryAsList(labels: string[]): Observable<TelemetryAny | null>[] {
        let telemetryObservables: Observable<TelemetryAny | null>[] = [];
        for (let label of labels) {
            telemetryObservables.push(this.telemetrySubjects.get(label)!.asObservable());
        }
        return telemetryObservables;
    }

    public onRoll(): Observable<TelemetryNumber | null> {
        return this.rollSubject.asObservable();
    }

    public onPitch(): Observable<TelemetryNumber | null> {
        return this.pitchSubject.asObservable();
    }

    public onYaw(): Observable<TelemetryNumber | null> {
        return this.yawSubject.asObservable();
    }

    public onArduinoConnected(): Observable<TelemetryBoolean | null> {
        return this.arduinoConnectedSubject.asObservable();
    }

    public onArmEnabled(): Observable<TelemetryBoolean | null> {
        return this.armEnabledSubject.asObservable();
    }

    public onArmManuleOverided(): Observable<TelemetryBoolean | null> {
        return this.armManuleOveridedSubject.asObservable();
    }

    public onArmYaw(): Observable<TelemetryNumber | null> {
        return this.armYawSubject.asObservable();
    }

    public onArmPitch1(): Observable<TelemetryNumber | null> {
        return this.armPitch1Subject.asObservable();
    }

    public onarmPitch2(): Observable<TelemetryNumber | null> {
        return this.armPitch2Subject.asObservable();
    }

    public onArmClaw(): Observable<TelemetryNumber | null> {
        return this.armClawSubject.asObservable();
    }

    public onClawStatus(): Observable<TelemetryString | null> {
        return this.clawStatusSubject.asObservable();
    }

    public onClawEnabled(): Observable<TelemetryBoolean | null> {
        return this.clawEnabledSubject.asObservable();
    }

    public onLocation(): Observable<TelemetryLocation | null> {
        return this.locationSubject.asObservable();
    }

    public onMovementEnabled(): Observable<TelemetryBoolean | null> {
        return this.movementEnabledSubject.asObservable();
    }

    public onMovementSpeed(): Observable<TelemetryNumber | null> {
        return this.movementSpeedSubject.asObservable();
    }

    public onMotorOneEnabled(): Observable<TelemetryBoolean | null> {
        return this.motorOneEnabledSubject.asObservable();
    }

    public onMotorOneForward(): Observable<TelemetryBoolean | null> {
        return this.motorOneForwardsSubject.asObservable();
    }

    public onMotorOneSpeed(): Observable<TelemetryNumber | null> {
        return this.motorOneSpeedSubject.asObservable();
    }

    public onMotorTwoEnabled(): Observable<TelemetryBoolean | null> {
        return this.motorTwoEnabledSubject.asObservable();
    }

    public onMotorTwoForward(): Observable<TelemetryBoolean | null> {
        return this.motorTwoForwardsSubject.asObservable();
    }

    public onMotorTwoSpeed(): Observable<TelemetryNumber | null> {
        return this.motorTwoSpeedSubject.asObservable();
    }

    public onMotorThreeEnabled(): Observable<TelemetryBoolean | null> {
        return this.motorThreeEnabledSubject.asObservable();
    }

    public onMotorThreeForward(): Observable<TelemetryBoolean | null> {
        return this.motorThreeForwardsSubject.asObservable();
    }

    public onMotorThreeSpeed(): Observable<TelemetryNumber | null> {
        return this.motorThreeSpeedSubject.asObservable();
    }

    public onMotorFourEnabled(): Observable<TelemetryBoolean | null> {
        return this.motorFourEnabledSubject.asObservable();
    }

    public onMotorFourForward(): Observable<TelemetryBoolean | null> {
        return this.motorFourForwardsSubject.asObservable();
    }

    public onMotorFourSpeed(): Observable<TelemetryNumber | null> {
        return this.motorFourSpeedSubject.asObservable();
    }
}
