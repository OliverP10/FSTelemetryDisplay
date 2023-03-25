import { Injectable } from '@angular/core';
import { Priority, Type } from '../Models/enumerations/Audio';
import { Sound } from '../Models/interfaces/Audio';
import DataManagerService from './data-manager.service';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private sounds = {
        sensorLost: { path: 'assets/audio/sensor_lost.mp3', type: Type.SENSOR_LOST, priority: Priority.HIGH },
        nominalBound: { path: 'assets/audio/sensor_failure.mp3', type: Type.NOMINAL_BOUNDRY, priority: Priority.HIGH },
        warningBound: { path: 'assets/audio/sensor_warning.mp3', type: Type.WARNING_BOUNDRY, priority: Priority.MEDIUM },
        arduinoFail: { path: 'assets/audio/arduino_failure.mp3', type: Type.ARUDINO_FAIL, priority: Priority.HIGH },
        telemLost: { path: 'assets/audio/telem_lost.mp3', type: Type.TELEMETRY_LOST, priority: Priority.HIGH },
        telemRecovered: { path: 'assets/audio/telem_recovered.mp3', type: Type.TELEMTRY_RECOVERED, priority: Priority.MEDIUM },
        masterWarning: { path: 'assets/audio/maste_warning.mp3', type: Type.MASTER_WARNING, priority: Priority.HIGH },
        warning: { path: 'assets/audio/warning.mp3', type: Type.WARNING, priority: Priority.MEDIUM }
    };

    private masterWarningPlayer = new Audio();
    private warningPlayer = new Audio();

    private player = new Audio();
    private mute: Boolean = true;
    private que: Sound[] = [];

    constructor() {
        this.load();
        let self = this;
        this.player.onended = function () {
            if (self.que.length != 0) {
                self.que.sort((a, b) => (a.priority > b.priority ? 1 : -1));
                self.playSound(self.que.pop()!);
            }
        };
    }

    private load() {
        this.masterWarningPlayer.src = this.sounds.masterWarning.path;
        this.masterWarningPlayer.load();
        this.masterWarningPlayer.loop = true;

        this.warningPlayer.src = this.sounds.warning.path;
        this.warningPlayer.load();
    }

    public setMute(mute: boolean) {
        this.mute = mute;
    }

    public isMute() {
        return this.mute;
    }

    public toggleMute() {
        this.mute = !this.mute;
        this.stopAllWarnings();
    }

    public isAudioPlaying(): boolean {
        return !this.player.paused;
    }

    public playMasterWarning() {
        if (this.masterWarningPlayer.paused && !this.mute) {
            this.masterWarningPlayer.play();
        }
    }

    public stopMasterWarning() {
        this.masterWarningPlayer.pause();
        this.masterWarningPlayer.currentTime = 0;
    }

    public playWarning() {
        if (this.warningPlayer.paused && !this.mute) {
            this.warningPlayer.play();
        }
    }

    public stopWarning() {
        this.warningPlayer.pause();
        this.warningPlayer.currentTime = 0;
    }

    public stopAllWarnings() {
        this.stopMasterWarning();
        this.stopWarning();
        this.que = [];
    }

    private playSound(sound: Sound) {
        if (this.mute) {
            return;
        }
        if (this.isAudioPlaying()) {
            this.que.push(sound);
            return;
        }

        this.player.src = sound.path;
        this.player.load();
        this.player.play();
    }

    playSensorLost() {
        this.playSound(this.sounds.sensorLost);
    }

    playNominalBounds() {
        this.playSound(this.sounds.nominalBound);
    }

    playWarningBounds() {
        this.playSound(this.sounds.warningBound);
    }

    playArduinoFail() {
        this.playSound(this.sounds.arduinoFail);
    }

    playTelemLost() {
        this.playSound(this.sounds.telemLost);
    }

    playTelemRecoverd() {
        this.playSound(this.sounds.telemRecovered);
    }
}
