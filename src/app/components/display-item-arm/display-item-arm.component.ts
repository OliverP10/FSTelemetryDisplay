import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Display } from 'src/app/Display';
import { faLock,faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject, takeUntil } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-display-item-arm',
  templateUrl: './display-item-arm.component.html',
  styleUrls: ['./display-item-arm.component.css']
})
export class DisplayItemArmComponent implements OnInit, OnDestroy{
  faLock=faLock
  faLockOpen=faLockOpen

  @ViewChild('container') containerElement: ElementRef;
  @Input() display: Display;

  private ngUnsubscribe = new Subject<void>();

  styleObj = {width:'400'};
  armControlsEnabled: boolean = true;
  armed:boolean = false;
  manualOverride: boolean = false;

  arm = {
    yaw: {
      value: 0,
      min: 0,
      max: 270,
    },
    pitch1: {
      value: 0,
      min: 0,
      max: 180,
    },
    pitch2: {
      value: 0,
      min: 0,
      max: 180,
    },
    claw: {
      value: 0,
      min: 0,
      max: 180,
    },
  }

  constructor(private settingService:SettingsService, private socketService: SocketService) {
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateArmStatus(data)})
    this.settingService.onResizeEvent().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data:any) => this.resizeSlider());
  }

  ngOnInit(): void {
  }

  updateArmStatus(data:any): void {
    
    if(data.hasOwnProperty('arm_enabled')){
      this.armed = (data['arm_enabled']) ? true : false
    }
    if(data.hasOwnProperty('arm_manual_override')){
      this.manualOverride = data['arm_manual_override']
    }
    if(data.hasOwnProperty('arm_yaw')){
      this.arm.yaw.value = data['arm_yaw']
    }
    if(data.hasOwnProperty('arm_pitch1')){
      this.arm.pitch1.value = data['arm_pitch1']
    }
    if(data.hasOwnProperty('arm_pitch2')){
      this.arm.pitch2.value = data['arm_pitch2']
    }
    if(data.hasOwnProperty('arm_claw')){
      this.arm.claw.value = data['arm_claw']
    }
    
  }

  change(event: any): any{
    return event.value;
  }

  update(): void {  //do validation on inputs when they are known
    if(this.armControlsEnabled){
      let values:any = {}
      for(let key in this.arm) {
        values["arm_"+key] = this.arm[key as keyof typeof this.arm].value
      }
      this.socketService.sendControlFrame(values)
    }
  }

  toggleArmed(): void {
    this.armed= !this.armed
    this.socketService.sendControlFrame({arm_armed: this.armed})
  }

  toggleManualOverride(): void {
    this.manualOverride = !this.manualOverride
    this.socketService.sendControlFrame({arm_override: this.manualOverride})
  }

  resizeSlider(): void {
    this.styleObj['width'] = this.containerElement.nativeElement.offsetWidth-200+"px"
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
