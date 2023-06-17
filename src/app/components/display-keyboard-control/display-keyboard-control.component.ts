import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-keyboard-control',
    templateUrl: './display-keyboard-control.component.html',
    styleUrls: ['./display-keyboard-control.component.css']
})
export class DisplayKeyboardControlComponent implements OnInit {
    @Input() screenItem: ScreenItem;
    @ViewChild('keyboardInput') keyboardInput: ElementRef<HTMLInputElement>;
    key_presses = new Set<string>();

    constructor(private socketService: SocketService) {}

    ngOnInit(): void {}

    onKeyUp(event: KeyboardEvent) {
        if (this.key_presses.has(event.key)) {
            this.socketService.sendControlFrame({ '12': event.key.charCodeAt(0) });
            this.key_presses.delete(event.key);
        }
        this.keyboardInput.nativeElement.value = '';
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.key_presses.has(event.key)) {
            this.socketService.sendControlFrame({ '11': event.key.charCodeAt(0) });
            this.key_presses.add(event.key);
        }
        this.keyboardInput.nativeElement.value = '';
    }
}
