import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faTimes, faAngleLeft, faAngleRight, faLeftRight, faUpDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import { Display, MoveScreenItem, ResizeScreenItem } from '../../Models/interfaces/Display';

@Component({
    selector: 'app-display-item-settings',
    templateUrl: './display-item-settings.component.html',
    styleUrls: ['./display-item-settings.component.css']
})
export class DisplayItemSettingsComponent implements OnInit {
    faTimes = faTimes;
    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;
    faLeftRight = faLeftRight;
    faUpDown = faUpDown;
    faPlus = faPlus;
    faMinus = faMinus;

    @Input() screenItem: ScreenItem;
    @Output() onDeleteScreenItem: EventEmitter<ScreenItem> = new EventEmitter();
    @Output() onMoveScreenItem: EventEmitter<MoveScreenItem> = new EventEmitter();
    @Output() onResizeScreenItem: EventEmitter<ResizeScreenItem> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    removeScreenItem(screenItem: ScreenItem) {
        this.onDeleteScreenItem.emit(screenItem);
    }

    moveScreenItem(direction: string) {
        let moveDisplay: MoveScreenItem = {
            screenItem: this.screenItem,
            direction: direction
        };
        this.onMoveScreenItem.emit(moveDisplay);
    }

    resizeScreenItem(resizeDisplay: ResizeScreenItem) {
        this.onResizeScreenItem.emit(resizeDisplay);
    }
}
