import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    faBars = faBars;

    constructor(private settingsService: SettingsService) {
        this.settingsService.setTitle('About');
        this.settingsService.setHeaderItems([]);
    }

    ngOnInit(): void {}

    toggleSideBar() {
        this.settingsService.toggleSidebar();
    }
}
