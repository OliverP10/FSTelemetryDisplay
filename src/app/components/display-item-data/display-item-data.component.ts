import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Display } from 'src/app/Display';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-display-item-data',
  templateUrl: './display-item-data.component.html',
  styleUrls: ['./display-item-data.component.css']
})
export class DisplayItemDataComponent implements OnInit, OnDestroy {
  @Input() display: Display;

  private ngUnsubscribe = new Subject<void>();

  jsonText: string

  constructor(private socketService: SocketService) { 
    socketService.onLiveData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {this.jsonText=JSON.stringify(data, null, "\t").trim()})
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
