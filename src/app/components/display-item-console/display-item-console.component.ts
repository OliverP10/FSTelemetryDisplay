import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Display';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-display-item-console',
  templateUrl: './display-item-console.component.html',
  styleUrls: ['./display-item-console.component.css']
})
export class DisplayItemConsoleComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() display: Display;
  @ViewChild('console') consoleRef: ElementRef;


  private ngUnsubscribe = new Subject<void>();

  logs: string[] = []

  constructor(private socketService: SocketService) {
    socketService.onLogs().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.updateLogs(data)})
  }

  ngOnInit(): void {
    this.logs = this.socketService.logs
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  updateLogs(data:any) {
    this.logs.push(data)
    this.scrollToBottom()
  }

  scrollToBottom(): void {
    try {
        this.consoleRef.nativeElement.scrollTop = this.consoleRef.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
