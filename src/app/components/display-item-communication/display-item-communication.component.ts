import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Display } from 'src/app/Models/interfaces/Display';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { NgStyle } from '@angular/common';
import { SocketService } from 'src/app/services/socket.service';
import { Subject, takeUntil } from 'rxjs';
import DataManagerService from 'src/app/services/data-manager.service';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-display-item-communication',
    templateUrl: './display-item-communication.component.html',
    styleUrls: ['./display-item-communication.component.css']
})
export class DisplayItemCommunicationComponent implements OnInit, OnDestroy {
    faCircle = faCircle;

    @Input() screenItem: ScreenItem;

    private ngUnsubscribe = new Subject<void>();

    styleOff: any = { color: 'rgb(62, 71, 90)' };
    styleOn: any = { color: 'rgb(29, 163, 52)' };

    buttonState = 0;

    constructor(private socketService: SocketService, private settingsService: SettingsService, private dataManagerService: DataManagerService) {}

    ngOnInit(): void {
        this.dataManagerService
            .onCustomTelemetry('DRIVER_INSTRUCTIONS')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((telemetry) => {
                if (telemetry != null) {
                    this.buttonState = telemetry!.value;
                }
            });
    }

    setButton(button: number) {
        this.buttonState = button == this.buttonState ? 0 : button;
        this.socketService.sendControlFrame({ 2: this.buttonState }); // adds offset 2 to avoid the reserved radio keys
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
