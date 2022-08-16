import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { faTimes, faAngleLeft, faAngleRight, faLeftRight, faUpDown, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import { Display, MoveDisplay, ResizeDisplay } from "../../Display";

@Component({
  selector: 'app-display-item-settings',
  templateUrl: './display-item-settings.component.html',
  styleUrls: ['./display-item-settings.component.css']
})
export class DisplayItemSettingsComponent implements OnInit {
  faTimes=faTimes
  faAngleLeft=faAngleLeft
  faAngleRight=faAngleRight
  faLeftRight=faLeftRight
  faUpDown=faUpDown
  faPlus=faPlus
  faMinus=faMinus

  @Input() display: Display;
  @Output() onDeleteDisplay:EventEmitter<Display> = new EventEmitter();
  @Output() onMoveDisplay:EventEmitter<MoveDisplay> = new EventEmitter();
  @Output() onResizeDisplay:EventEmitter<ResizeDisplay> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  removeDisplay(display: Display) {
    this.onDeleteDisplay.emit(display);
  }

  moveDisplay(direction:string) {
    let moveDisplay:MoveDisplay = {
      display: this.display,
      direction: direction
    };
    this.onMoveDisplay.emit(moveDisplay);
  }

  resizeDisplay(resizeDisplay:ResizeDisplay) {
    this.onResizeDisplay.emit(resizeDisplay);
  }


}
