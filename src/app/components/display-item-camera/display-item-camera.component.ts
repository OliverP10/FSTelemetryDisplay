import { Component, OnInit, Input } from '@angular/core';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';

@Component({
    selector: 'app-display-item-camera',
    templateUrl: './display-item-camera.component.html',
    styleUrls: ['./display-item-camera.component.css']
})
export class DisplayItemCameraComponent implements OnInit {
    @Input() screenItem: ScreenItem;

    url: string;
    loadingError: boolean;

    constructor() {}

    ngOnInit(): void {
        this.loadingError = false;
        this.url = 'http://' + this.screenItem.display.options.cameraIP;
    }

    imgError() {
        this.loadingError = true;
    }
}
