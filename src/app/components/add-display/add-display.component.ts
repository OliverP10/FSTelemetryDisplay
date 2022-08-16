import { Component, Inject, OnInit, Output,EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Display } from 'src/app/Display';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-display',
  templateUrl: './add-display.component.html',
  styleUrls: ['./add-display.component.css'],
})
export class AddDisplayComponent implements OnInit {
  @Output() onAddDisplay:EventEmitter<Display> = new EventEmitter();

  allDisplaysData: MatTableDataSource<Display[]>;
  tableColums: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {
    this.allDisplaysData = new MatTableDataSource(data.allDisplays);
    console.log(this.allDisplaysData)
    this.tableColums=["title","type","dataLabels","addButton"]
  }

  ngOnInit(): void {
  }

  onClickAdd(display:Display) {
    this.onAddDisplay.emit(display);
  }

  applyFilter(event:Event) {
    this.allDisplaysData.filter = (<HTMLTextAreaElement>event.target).value.trim().toLowerCase();
  }


}
