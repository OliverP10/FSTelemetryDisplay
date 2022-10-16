import { Component, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef, OnChanges, OnInit, HostListener } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { settingDropDown } from 'src/app/animations/animations';
import { ScreenItem } from 'src/app/interfaces/Screen';
import { SettingsService } from 'src/app/services/settings.service';
import { Display, MoveScreenItem, ResizeScreenItem, Size } from '../../interfaces/Display';

@Component({
    selector: 'app-screen-item',
    templateUrl: './screen-item.component.html',
    styleUrls: ['./screen-item.component.css'],
    animations: [settingDropDown]
})
export class ScreenItemComponent implements AfterViewInit, OnChanges, OnInit {
    @Input() screenItem: ScreenItem;
    @Output() onDeleteScreenItem: EventEmitter<ScreenItem> = new EventEmitter();
    @Output() onMoveScreenItem: EventEmitter<MoveScreenItem> = new EventEmitter();
    @Output() onResizeScreenItem: EventEmitter<ResizeScreenItem> = new EventEmitter();
    @ViewChild('container') containerElement: ElementRef;

    dropDownIcon = faCaretDown;
    showSettings: boolean = false;

    constructor(private settingsService: SettingsService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    ngOnChanges(changes: SimpleChanges) {}

    toggleDropDown(): void {
        this.setDropDown(!this.showSettings);
    }

    setDropDown(showSettings: boolean): void {
        this.showSettings = showSettings;
        this.dropDownIcon = this.showSettings ? faCaretUp : faCaretDown;
        this.settingsService.resizeEvent();
    }

    removeScreenItem(screenItem: ScreenItem): void {
        this.onDeleteScreenItem.emit(screenItem);
    }

    moveScreenItem(moveScreenItem: MoveScreenItem): void {
        this.onMoveScreenItem.emit(moveScreenItem);
    }

    resizeScreenItem(resizeScreenItem: ResizeScreenItem): void {
        this.onResizeScreenItem.emit(resizeScreenItem);
    }
}
