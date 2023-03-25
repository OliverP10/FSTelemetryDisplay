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

    buttons = {
        boxBtn: false,
        slowBtn: false,
        pushBtn: false
    };

    constructor(private socketService: SocketService, private settingsService: SettingsService) {}

    ngOnInit(): void {}

    setButton(button: string) {
        for (let key in this.buttons) {
            if (key == button) {
                this.buttons[key as keyof typeof this.buttons] = !this.buttons[key as keyof typeof this.buttons];
            } else {
                this.buttons[key as keyof typeof this.buttons] = false;
            }
        }
        this.socketService.sendControlFrame(this.buttons);
    }

    updateButtons(data: any) {
        if (data.hasOwnProperty('boxBtn')) {
            this.buttons.boxBtn = data['boxBtn'] ? true : false;
        }
        if (data.hasOwnProperty('slowBtn')) {
            this.buttons.slowBtn = data['slowBtn'] ? true : false;
        }
        if (data.hasOwnProperty('pushBtn')) {
            this.buttons.pushBtn = data['pushBtn'] ? true : false;
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
