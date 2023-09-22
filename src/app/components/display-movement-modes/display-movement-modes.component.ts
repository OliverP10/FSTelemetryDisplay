import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { TelemetryNumber } from 'src/app/Models/interfaces/Telemetry';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';
import { faGroupArrowsRotate, faArrowsUpDownLeftRight, faCar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-display-movement-modes',
  templateUrl: './display-movement-modes.component.html',
  styleUrls: ['./display-movement-modes.component.css']
})
export class DisplayMovementModesComponent implements OnInit {

  @Input() screenItem: ScreenItem;
  faGroupArrowsRotate = faGroupArrowsRotate;
  faArrowsUpDownLeftRight = faArrowsUpDownLeftRight;
  faCar = faCar;

  private ngUnsubscribe = new Subject<void>();
  movementMode: number = 0;

  constructor(private socketService: SocketService, private dataManagerService: DataManagerService) {
      this.dataManagerService.movementModeSubject
          .asObservable()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((telemetry) => {
              this.setMovementMode(telemetry);
          });
  }

  ngOnInit(): void {}

  setMovementMode(telemetry: TelemetryNumber | null) {
      if (telemetry != null) {
          this.movementMode = telemetry.value;
      }
  }

  sendMovementModeCommand(command: number): void {
      this.socketService.sendControlFrame({ '17': command });
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }

}
