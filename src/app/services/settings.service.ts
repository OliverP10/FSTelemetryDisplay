import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private resizeSubject = new Subject<any>();
  private sidebarSubject = new Subject<any>();
  private viewSubject = new Subject<any>();

  view:string = "dashboard"

  constructor() { }

  resizeEvent(): void {
    setTimeout(()=> this.resizeSubject.next(null)); //https://stackoverflow.com/questions/38763248/angular-2-life-cycle-hook-after-all-children-are-initialized
  }

  onResizeEvent(): Observable<any> {
    return this.resizeSubject.asObservable();
  }

  toggleSidebar(): void {
    this.sidebarSubject.next(null)
  }

  onToggleSidebar(): Observable<any> {
    return this.sidebarSubject.asObservable();
  }

  setView(view: string): void {
    this.view=view;
    this.viewSubject.next(this.view)
  }

  onSetView(): Observable<any> {
    return this.viewSubject.asObservable();
  }


}
