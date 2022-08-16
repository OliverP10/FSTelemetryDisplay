import { Component, OnInit, Input } from '@angular/core';
import { Display } from 'src/app/Display';
import { ROOT_URL } from 'src/app/Display';

@Component({
  selector: 'app-display-item-camera',
  templateUrl: './display-item-camera.component.html',
  styleUrls: ['./display-item-camera.component.css']
})
export class DisplayItemCameraComponent implements OnInit {
  @Input() display: Display;

  url: string;
  loadingError: boolean;

  constructor() { }

  ngOnInit(): void {
    this.loadingError=false;
    this.url="http://"+this.display.options.cameraIP
  }

  imgError() {
    this.loadingError = true
  }

}
