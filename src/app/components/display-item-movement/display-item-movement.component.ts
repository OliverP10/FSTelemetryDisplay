import { AfterViewInit, Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import { faSquare, faArrowUp, faArrowDown, faLock, faCircleArrowUp, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Display';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-display-item-movement',
  templateUrl: './display-item-movement.component.html',
  styleUrls: ['./display-item-movement.component.css']
})

export class DisplayItemMovementComponent implements OnInit, OnDestroy{
  @Input() display: Display;

  faSquare=faSquare
  faArrowUp=faArrowUp
  faArrowDown=faArrowDown
  faLock=faLock
  faCircleArrowUp=faCircleArrowUp

  private ngUnsubscribe = new Subject<void>();

  armed: boolean = true
  speed: number = 0
  motors = {
    motor_one: {
      enabled: false,
      forwards: true,
      speed:0.2,
    },
    motor_two: {
      enabled: false,
      forwards: true,
      speed:0.2,
    },
    motor_three: {
      enabled: false,
      forwards: true,
      speed:0.2,
    },
    motor_four: {
      enabled: false,
      forwards: true,
      speed:0.2,
    },
  }

  constructor(private socketService: SocketService) {
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateMovementStatus(data)})
  }

  ngOnInit(): void {
  }

  updateMovementStatus(data:any): void {
    if(data.hasOwnProperty('movement_enabled')) {
      this.armed = (data['movement_enabled']) ? true : false
    }
    if(data.hasOwnProperty('movement_speed')) {
      if(this.speed != data['movement_speed']) {
        this.speed = data['movement_speed']
      }
    }
    for(let key in this.motors) {
      if(data.hasOwnProperty(key+"_enabled")){
        this.motors[key as keyof typeof this.motors].enabled = data[key+"_enabled"]
      }
      if(data.hasOwnProperty(key+"_forwards")){
        this.motors[key as keyof typeof this.motors].forwards = data[key+"_forwards"]
      }
      if(data.hasOwnProperty(key+"_speed")){
        this.motors[key as keyof typeof this.motors].speed = data[key+"_speed"]
      }
    }

  }

  toggleArmed(): void {
    this.armed= !this.armed
    this.socketService.sendControlFrame({movement_armed: this.armed})
  }

  updateSpeed(event:any): void {
    let speed: number = parseFloat(event.target.value)
    if(speed>=0 && speed <= 1) {
      this.socketService.sendControlFrame({"movement_speed": speed})
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
