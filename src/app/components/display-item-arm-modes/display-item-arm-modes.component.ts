import { Component, OnInit, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-item-arm-modes',
    templateUrl: './display-item-arm-modes.component.html',
    styleUrls: ['./display-item-arm-modes.component.css']
})
export class DisplayItemArmModesComponent implements OnInit {
    @Input() screenItem: ScreenItem;

    constructor(private socketService: SocketService) {}

    ngOnInit(): void {}

    sendArmCommand(command: string): void {
        let controlFrame: any = {};
        controlFrame['arm_sequence'] = command;
        this.socketService.sendControlFrame(controlFrame);
    }
}
