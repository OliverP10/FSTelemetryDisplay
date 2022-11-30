import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { titleCase } from 'src/shared/utils/formatter';
import { ScreenName } from '../Models/interfaces/Screen';
import { HeaderItems } from '../Models/interfaces/Settings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private resizeSubject = new Subject<any>();
    private sidebarSubject = new Subject<any>();
    private toggleAddDisplaySubject = new Subject<any>();
    private saveScreenSubject = new Subject<any>();

    private title: ScreenName = '';
    private headerItems = new Set<string>();

    constructor() {}

    resizeEvent(): void {
        setTimeout(() => this.resizeSubject.next(null)); //https://stackoverflow.com/questions/38763248/angular-2-life-cycle-hook-after-all-children-are-initialized
    }

    onResizeEvent(): Observable<any> {
        return this.resizeSubject.asObservable();
    }

    toggleSidebar(): void {
        this.sidebarSubject.next(null);
    }

    onToggleSidebar(): Observable<any> {
        return this.sidebarSubject.asObservable();
    }

    setTitle(title: ScreenName) {
        this.title = title;
    }

    setTitleFromName(title: string) {
        this.title = <ScreenName>titleCase(title.replace('-', ' '));
    }

    getTitle() {
        return this.title;
    }

    setHeaderItems(items: HeaderItems[]) {
        this.headerItems.clear();
        items.forEach((item) => this.headerItems.add(item));
    }

    getHeaderItems(): Set<string> {
        return this.headerItems;
    }

    toggleAddDisplay(): void {
        this.toggleAddDisplaySubject.next(null);
    }

    onToggleAddDispplay(): Observable<any> {
        return this.toggleAddDisplaySubject.asObservable();
    }

    saveScreens(): void {
        this.saveScreenSubject.next(null);
    }

    onSaveScreen(): Observable<any> {
        return this.saveScreenSubject.asObservable();
    }
}
