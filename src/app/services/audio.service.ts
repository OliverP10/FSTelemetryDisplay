import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  sounds:any = {
    sensorLost: "assets/sensor_lost.mp3",
    nominalBound: "assets/sensor_failure.mp3",
    warningBound: "assets/sensor_warning.mp3",
    arduinoFail: "assets/arduino_failure.mp3",
    telemLost: "assets/telem_lost.mp3",
    telemRecovered: "assets/telem_recovered.mp3",
    multiSenseError: "assets/multiple_sensor_error.mp3",
  }
  audio = new Audio();
  mute:Boolean = true

  constructor() { }

  setMute(mute:boolean) {
    this.mute = mute;
  }

  playSound(sound:string) {
    if(this.mute){return}
    this.audio.src = this.sounds[sound];
    this.audio.load();
    this.audio.play();
  }

  isAudioPlaying():boolean {
    return !this.audio.paused
  }

}
