import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Display';
import { SocketService } from 'src/app/services/socket.service';
import { faMaximize, faMinimize } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-display-item-claw',
  templateUrl: './display-item-claw.component.html',
  styleUrls: ['./display-item-claw.component.css']
})
export class DisplayItemClawComponent implements OnInit, OnDestroy {
  @Input() display: Display;

  faMaximize=faMaximize
  faMinimize=faMinimize

  armed: boolean = false;
  state: string= "neutral";

  private ngUnsubscribe = new Subject<void>();

  constructor(private socketService: SocketService) {
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateClawStatus(data)})
  }

  ngOnInit(): void {
  }

  updateClawStatus(data:any) {
    if(data.hasOwnProperty('claw_status')) {
      this.state = data['claw_status']
    }
    if(data.hasOwnProperty('claw_enabled')) {
      this.armed = data['claw_enabled']
    }
  }

  toggleArmed(): void {
    this.armed= !this.armed
    this.socketService.sendControlFrame({claw_armed: this.armed})
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
