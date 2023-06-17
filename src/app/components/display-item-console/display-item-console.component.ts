import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Models/interfaces/Display';
import { ScreenItem } from 'src/app/Models/interfaces/Screen';
import DataManagerService from 'src/app/services/data-manager.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-display-item-console',
    templateUrl: './display-item-console.component.html',
    styleUrls: ['./display-item-console.component.css']
})
export class DisplayItemConsoleComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() screenItem: ScreenItem;
    @ViewChild('console') consoleRef: ElementRef;

    private ngUnsubscribe = new Subject<void>();

    constructor(public dataManagerService: DataManagerService) {
        this.dataManagerService
            .onLogs()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((log) => {
                this.updateLogs(log);
            });
    }

    ngOnInit(): void {}

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    updateLogs(data: any) {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.consoleRef.nativeElement.scrollTop = this.consoleRef.nativeElement.scrollHeight;
        } catch (err) {}
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
