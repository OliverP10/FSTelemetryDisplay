import { Component, AfterViewInit , Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef ,OnChanges, OnInit, HostListener} from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { settingDropDown } from 'src/app/animations';
import { SettingsService } from 'src/app/services/settings.service';
import { Display, MoveDisplay, ResizeDisplay, Size} from "../../Display";

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.css'],
  animations: [settingDropDown]
})
export class DisplayItemComponent implements AfterViewInit , OnChanges, OnInit {
  @Input() display: Display;
  @Output() onDeleteDisplay:EventEmitter<Display> = new EventEmitter();
  @Output() onMoveDisplay:EventEmitter<MoveDisplay> = new EventEmitter();
  @Output() onResizeDisplay:EventEmitter<ResizeDisplay> = new EventEmitter();
  @ViewChild('container') containerElement: ElementRef;

  dropDownIcon=faCaretDown
  showSettings: boolean = false;

  constructor(private settingsService: SettingsService) {

  }

  ngOnInit(): void {
      if(!this.display.hasOwnProperty('options')){
        this.display['options']={};
      }
  }

  ngAfterViewInit (): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  toggleDropDown(): void {
    this.setDropDown(!this.showSettings);
  }

  setDropDown(showSettings: boolean): void {
    this.showSettings = showSettings
    this.dropDownIcon = (this.showSettings) ? faCaretUp : faCaretDown;
    this.settingsService.resizeEvent();
  }

  removeDisplay(display: Display): void {
    this.onDeleteDisplay.emit(display);
  }

  moveDisplay(moveDisplay:MoveDisplay): void {
    this.onMoveDisplay.emit(moveDisplay);
  }

  resizeDisplay(resizeDisplay:ResizeDisplay): void {
    this.onResizeDisplay.emit(resizeDisplay);
  }


}

