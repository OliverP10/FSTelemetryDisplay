import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Event } from '../Models/interfaces/Events';
import { TelemetryAny, TelemetryBoolean, TelemetryLocation, TelemetryNumber, TelemetryString } from '../Models/interfaces/Telemetry';
import { AudioService } from './audio.service';
import { WarningService } from './warning.service';

@Injectable({
    providedIn: 'root'
})
export default class DataManagerService {
    private telemetrySubject = new Subject<TelemetryAny>();
    private telemetryCompleteSubject = new Subject<null>();
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
    public rfRadioConnected = new BehaviorSubject<TelemetryNumber | null>(null);
    public synchonizeRadio = new BehaviorSubject<TelemetryNumber | null>(null);
    public rollSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public pitchSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public yawSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public swaySubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public heaveSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public surgeSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public oilPressureSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public knockSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public steeringAngleSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public chasisDeflectionSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public suspensionDeflectionSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public fulePressureSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public longitudeSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public latititudeSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public exaustTempratureSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public oilPressureAdvancedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public diffuserPitotTubeSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public flWheelSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public frWheelSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public blWheelSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public brWheelSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public flSuspensrionTravelSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public frSuspensrionTravelSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public blSuspensrionTravelSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public brSuspensrionTravelSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public frRideHightSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public flRideHightSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public brRideHightSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public blRideHightSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public driverInstructions = new BehaviorSubject<TelemetryNumber | null>(null);

    // rover
    public arduinoConnectedSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public armEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public armManuleOveridedSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public armYawSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public armPitch1Subject = new BehaviorSubject<TelemetryNumber | null>(null);
    public armPitch2Subject = new BehaviorSubject<TelemetryNumber | null>(null);
    public armClawSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public clawStatusSubject = new BehaviorSubject<TelemetryString | null>(null);
    public clawEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public movementEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public movementSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public motorOneEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorOneForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorOneSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public motorTwoEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorTwoForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorTwoSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public motorThreeEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorThreeForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorThreeSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);
    public motorFourEnabledSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorFourForwardsSubject = new BehaviorSubject<TelemetryBoolean | null>(null);
    public motorFourSpeedSubject = new BehaviorSubject<TelemetryNumber | null>(null);

    constructor(private warningService: WarningService) {
        this.telemetrySubjects.set('RF_RADIO_CONNECTED', this.rfRadioConnected);
        this.telemetrySubjects.set('SYNCHRONIZE_RADIO', this.synchonizeRadio);
        this.telemetrySubjects.set('ROLL', this.rollSubject);
        this.telemetrySubjects.set('PITCH', this.pitchSubject);
        this.telemetrySubjects.set('YAW', this.yawSubject);
        this.telemetrySubjects.set('SWAY', this.swaySubject);
        this.telemetrySubjects.set('HEAVE', this.heaveSubject);
        this.telemetrySubjects.set('SURGE', this.surgeSubject);
        this.telemetrySubjects.set('OIL_PRESSURE', this.oilPressureSubject);
        this.telemetrySubjects.set('KNOCK', this.knockSubject);
        this.telemetrySubjects.set('STEERING_ANGLE', this.steeringAngleSubject);
        this.telemetrySubjects.set('CHASIS_DEFLECTION', this.chasisDeflectionSubject);
        this.telemetrySubjects.set('SUSPENSION_DEFLECTION', this.suspensionDeflectionSubject);
        this.telemetrySubjects.set('FUEL_PRESSURE', this.fulePressureSubject);
        this.telemetrySubjects.set('LATITUDE', this.longitudeSubject);
        this.telemetrySubjects.set('LONGITUDE', this.latititudeSubject);
        this.telemetrySubjects.set('EXAUST_TEMPRATURE', this.exaustTempratureSubject);
        this.telemetrySubjects.set('OIL_PRESSURE_ADVANCED', this.oilPressureAdvancedSubject);
        this.telemetrySubjects.set('DIFFUSER_PITOT_TUBE', this.diffuserPitotTubeSubject);
        this.telemetrySubjects.set('DIFFUSER_PRESSURE_TAPPINGS', this.diffuserPitotTubeSubject);
        this.telemetrySubjects.set('FL_WHEEL_SPEED', this.flWheelSpeedSubject);
        this.telemetrySubjects.set('FR_WHEEL_SPEED', this.frWheelSpeedSubject);
        this.telemetrySubjects.set('BL_WHEEL_SPEED', this.blWheelSpeedSubject);
        this.telemetrySubjects.set('BR_WHEEL_SPEED', this.brWheelSpeedSubject);
        this.telemetrySubjects.set('FL_SUSPENSION_TRAVEL', this.flSuspensrionTravelSubject);
        this.telemetrySubjects.set('FR_SUSPENSION_TRAVEL', this.frSuspensrionTravelSubject);
        this.telemetrySubjects.set('BL_SUSPENSION_TRAVEL', this.blSuspensrionTravelSubject);
        this.telemetrySubjects.set('BR_SUSPENSION_TRAVEL', this.brSuspensrionTravelSubject);
        this.telemetrySubjects.set('FR_RIDE_HIGHT', this.frRideHightSubject);
        this.telemetrySubjects.set('FL_RIDE_HIGHT', this.flRideHightSubject);
        this.telemetrySubjects.set('BR_RIDE_HIGHT', this.brRideHightSubject);
        this.telemetrySubjects.set('BL_RIDE_HIGHT', this.blRideHightSubject);
        this.telemetrySubjects.set('DRIVER_INSTRUCTIONS', this.driverInstructions);

        this.telemetrySubjects.set('ARDUINO_CONNECTED', this.arduinoConnectedSubject);
        this.telemetrySubjects.set('ARM_ENABLED', this.armEnabledSubject);
        this.telemetrySubjects.set('ARM_MANULE_OVERIDE', this.armManuleOveridedSubject);
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

    public onTelemetryComplete(): Observable<null> {
        return this.telemetryCompleteSubject.asObservable();
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
        this.telemetryCompleteSubject.next(null);
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
        if (this.telemetrySubjects.has(telemetry.metadata.label)) {
            this.telemetrySubjects.get(telemetry.metadata.label)?.next(telemetry);
        } else {
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
}
