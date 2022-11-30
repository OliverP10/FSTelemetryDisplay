import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { faHouse, faRss, faCircleInfo, faSquarePlus, faCar, faGaugeHigh, faRocket, faChartLine, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    faHouse = faHouse;
    faRss = faRss;
    faCar = faCar;
    faCircleInfo = faCircleInfo;
    faSquarePlus = faSquarePlus;
    faGaugeHigh = faGaugeHigh;
    faRocket = faRocket;
    faChartLine = faChartLine;
    faSatelliteDish = faSatelliteDish;

    title = 'UOL-Racing';
    showSidebar: boolean = false;

    constructor(public settingsService: SettingsService) {
        settingsService.onToggleSidebar().subscribe((showSidebar) => {
            this.showSidebar = !this.showSidebar;
        });
    }

    toggleSideBar() {
        this.settingsService.toggleSidebar();
    }
}
