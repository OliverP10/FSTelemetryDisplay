import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Display, MoveScreenItem, ResizeScreenItem } from '../../Models/interfaces/Display';
import { SettingsService } from 'src/app/services/settings.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/services/socket.service';
import { expandContract, expandContractList } from 'src/app/animations/animations';
import { environment } from 'src/environments/environment';
import { DBScreenItem, Screen, ScreenItem } from 'src/app/Models/interfaces/Screen';
import { objectListToMap } from 'src/shared/utils/formatter';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingSatus } from 'src/app/Models/enumerations/Telemetry';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-screens',
    templateUrl: './screens.component.html',
    styleUrls: ['./screens.component.css'],
    animations: [expandContractList, expandContract]
})
export class ScreensComponent implements OnInit, AfterViewInit, OnDestroy {
    readonly URL = environment.ROOT_URL + environment.API_PORT;
    screens: Map<string, Screen> = new Map<string, Screen>(); //key is a screen and value is a list of display ids
    displays: Display[] = []; //All saved displays on server
    screenItems: ScreenItem[] = []; //Displays being show
    key_presses = new Set<string>();
    showLoadingSpinner: boolean = false;

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService,
        private socketService: SocketService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.settingsService.setTitleFromName(this.activatedRoute.snapshot.params['screen']);
        this.settingsService
            .onToggleAddDispplay()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.toggleAddDisplay());
        this.settingsService
            .onSaveScreen()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.saveScreen());
        this.socketService
            .onTelemetryLoadingSubject()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((status: LoadingSatus) => (this.showLoadingSpinner = status == LoadingSatus.LOADING ? true : false));
    }

    ngOnInit(): void {
        this.settingsService.setHeaderItems(['add', 'save', 'keyboard', 'connectionRoute']);

        forkJoin({
            displays: this.http.get<Display[]>(this.URL + '/display/get'),
            screens: this.http.get<Screen[]>(this.URL + '/screen/get')
        }).subscribe((data: any) => {
            this.displays = data.displays.display;
            this.screens = objectListToMap('name', data.screens.screen);
            this.loadScreen(this.activatedRoute.snapshot.params['screen']);
        });
    }

    ngAfterViewInit(): void {
        this.settingsService.resizeEvent(); //once everything is loaded call resize
    }

    loadScreen(screenName: string) {
        this.screenItems = [];
        let screen: Screen = this.screens.get(screenName)!;
        this.screenItems = screen.screenItems;
        this.settingsService.resizeEvent();
    }

    updateScreens() {
        //this.screens.set(this.settingsService.getView(), { name: this.settingsService.getView(), displayName: this.settingsService.getTitle(), screenItems: this.screenItems });
    }

    addScreenItem(display: Display): void {
        if (typeof this.screenItems.find((si) => si.display._id === display._id) === 'undefined') {
            let screenItem: ScreenItem = {
                display: display,
                colSize: display.colSize,
                rowSize: display.rowSize,
                options: {}
            };
            this.screenItems.push(screenItem);
        }
        this.settingsService.resizeEvent();
        this.updateScreens();
    }

    deleteScreenItem(screenItem: ScreenItem): void {
        this.screenItems = this.screenItems.filter((si) => si.display._id !== screenItem.display._id);
        this.updateScreens();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.screenItems, event.previousIndex, event.currentIndex);
        this.updateScreens();
    }

    moveScreenItem(moveScreenItem: MoveScreenItem): void {
        let index = this.screenItems.indexOf(moveScreenItem.screenItem);
        let swapDirection = moveScreenItem.direction == 'left' ? -1 : +1;
        if ((moveScreenItem.direction == 'left' && index + swapDirection >= 0) || (moveScreenItem.direction == 'right' && index + swapDirection < this.screenItems.length)) {
            let temp = this.screenItems[index];
            this.screenItems[index] = this.screenItems[index + swapDirection];
            this.screenItems[index + swapDirection] = temp;
        }
        this.updateScreens();
    }

    resizeScreenItem(resizeScreenItem: ResizeScreenItem): void {
        let index = this.screenItems.indexOf(resizeScreenItem.screenItem);
        if (resizeScreenItem.axis == 'vertical' && this.screenItems[index].rowSize + resizeScreenItem.change <= 4 && this.screenItems[index].rowSize + resizeScreenItem.change > 0) {
            this.screenItems[index].rowSize += resizeScreenItem.change;
        } else if (resizeScreenItem.axis == 'horizontal' && this.screenItems[index].colSize + resizeScreenItem.change <= 4 && this.screenItems[index].colSize + resizeScreenItem.change > 0) {
            this.screenItems[index].colSize += resizeScreenItem.change;
        }
        this.settingsService.resizeEvent();
        this.updateScreens();
    }

    toggleAddDisplay(): void {
        const ref = this.dialogRef.open(AddDisplayComponent, {
            height: '80%',
            width: '50%',
            data: {
                displays: this.displays
            }
        });

        const sub = ref.componentInstance.onAddDisplay.subscribe((display: Display) => {
            this.addScreenItem(display);
        });
    }

    saveScreen() {
        // if (this.settingsService.getView() == 'custom') {
        //     return;
        // }
        let screensItems = this.screenItems.map((s: ScreenItem) => ({ display: s.display._id, colSize: s.colSize, rowSize: s.rowSize, options: s.options }));
        this.http.patch<ScreenItem[]>(this.URL + '/screen/update/' + this.activatedRoute.snapshot.params['screen'], { screenItems: screensItems }).subscribe({
            next: (v) => {
                this.snackBar.open(this.settingsService.getTitle() + ' saved', 'Dismiss', { duration: 3000 });
            },
            error: (e: HttpErrorResponse) => {
                this.snackBar.open(e.error.message, 'Dismiss', {
                    duration: 3000
                });
            }
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardDownEvent(event: KeyboardEvent) {
        if (!this.key_presses.has(event.key)) {
            console.log();
            this.socketService.sendControlFrame({ '102': event.key.charCodeAt(0) });
            this.key_presses.add(event.key);
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardUpEvent(event: KeyboardEvent) {
        if (this.key_presses.has(event.key)) {
            this.socketService.sendControlFrame({ '103': event.key.charCodeAt(0) });
            this.key_presses.delete(event.key);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.settingsService.resizeEvent();
    }
}
