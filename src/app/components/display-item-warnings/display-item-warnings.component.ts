import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatTable } from '@angular/material/table';
import { faMinus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

import { ErrorData, Display } from 'src/app/Display';


@Component({
  selector: 'app-display-item-warnings',
  templateUrl: './display-item-warnings.component.html',
  styleUrls: ['./display-item-warnings.component.css'],
})
export class DisplayItemWarningsComponent implements OnInit, OnDestroy {
  @Input() display: Display;
  @ViewChild(MatTable) table: MatTable<ErrorData[]>;

  private ngUnsubscribe = new Subject<void>();

  faMinus=faMinus
  faTriangleExclamation=faTriangleExclamation

  errorDataColumns: string[];

  constructor(public socketService: SocketService,private settingsService: SettingsService) {
    this.socketService.onWarnings().pipe(takeUntil(this.ngUnsubscribe)).subscribe((errors)=> this.updateWarnings(errors));

    this.errorDataColumns = ["symbol","dataLabel","type","error","btnRemove"]
  }

  ngOnInit(): void {
  }

  updateWarnings(errors:ErrorData[]) {
    this.table.renderRows();
  }

  removeError(error:ErrorData) {
    this.socketService.errors=this.socketService.errors.filter((e)=>(e.dataLabel!=error.dataLabel)||(e.type!=error.type));
    this.table.renderRows();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
