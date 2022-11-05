import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MasterWarningState, WarningState } from '../Models/enumerations/Warning';
import { Event } from '../Models/interfaces/Events';
import { AudioService } from './audio.service';

@Injectable({
    providedIn: 'root'
})
export class WarningService {
    private warningSubject = new Subject<Event>();
    private criticalWarningSubject = new Subject<Event>();

    private masterWarningStateSubject = new Subject<MasterWarningState>();
    private masterWarningState: MasterWarningState = MasterWarningState.OFF;
    private masterWarningTimeout: any;
    private masterWarningAudioDelayTimeout: any;

    private warningState: WarningState = WarningState.OFF;
    private warningTimeout: any;
    private warningAudioDelayTimeout: any;

    constructor(private audioService: AudioService) {}

    public decodeEvent(event: Event) {
        switch (event.metadata.type) {
            case 'warning':
                this.warningSubject.next(event);
                this.playWarning(event);
                break;
            case 'critical warning':
                this.criticalWarningSubject.next(event);
                this.playCriticalWarning(event);
                break;
            default:
                console.error('No matching event found for: ' + event);
        }
    }

    private playWarning(event: Event) {
        this.triggerWarning();
        clearTimeout(this.warningAudioDelayTimeout);
        this.warningAudioDelayTimeout = setTimeout(() => {
            if (event.trigger === 'warningBoundCheck') {
                this.audioService.playWarningBounds();
            }
        }, 500);
    }

    private playCriticalWarning(event: Event) {
        this.triggerMasterWarning();
        clearTimeout(this.masterWarningAudioDelayTimeout);
        this.masterWarningAudioDelayTimeout = setTimeout(() => {
            if (event.trigger === 'nominalBoundCheck') {
                this.audioService.playNominalBounds();
            }
        }, 500);
    }

    public acknoldegeMasterWarning() {
        switch (this.masterWarningState) {
            case MasterWarningState.ON:
                this.silenceMasterWarning();
                break;
            case MasterWarningState.COMPLETED:
                this.stopMasterWarning();
                break;
        }
    }

    private triggerMasterWarning() {
        this.setMasterWarningState(MasterWarningState.ON);
        this.audioService.playMasterWarning();
        clearTimeout(this.masterWarningTimeout);
        this.masterWarningTimeout = setTimeout(() => {
            if (this.masterWarningState == MasterWarningState.SILENCED) {
                this.stopMasterWarning();
            } else {
                this.setMasterWarningState(MasterWarningState.COMPLETED);
            }
        }, 10000);
    }

    private stopMasterWarning() {
        this.setMasterWarningState(MasterWarningState.OFF);
        this.audioService.stopMasterWarning();
        clearTimeout(this.masterWarningTimeout);
    }

    public silenceMasterWarning() {
        this.audioService.stopMasterWarning();
        this.setMasterWarningState(MasterWarningState.SILENCED);
    }

    private setMasterWarningState(state: MasterWarningState) {
        this.masterWarningState = state;
        this.masterWarningStateSubject.next(this.masterWarningState);
    }

    private triggerWarning() {
        this.warningState = WarningState.ON;
        this.audioService.playWarning();
        clearTimeout(this.warningTimeout);
        this.warningTimeout = setTimeout(() => {
            this.warningState = WarningState.OFF;
        }, 5000);
    }

    public getMasterWarningState() {
        return this.masterWarningState;
    }

    public getWarningState() {
        return this.warningState;
    }

    public onWarning() {
        return this.warningSubject.asObservable();
    }

    public onCriticalWarning() {
        return this.criticalWarningSubject.asObservable();
    }

    public onMasterWarningState() {
        return this.masterWarningStateSubject.asObservable();
    }
}
