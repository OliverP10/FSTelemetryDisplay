import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { faPlus, faBars, faSignal, faTriangleExclamation, faVolumeHigh, faVolumeMute, faPlug, faPlugCircleXmark, faFloppyDisk, faDownload, faTruckMonster} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { AddDisplayComponent } from '../add-display/add-display.component';
import { Display, ROOT_URL } from 'src/app/Display';
import { SettingsService } from 'src/app/services/settings.service';
import { SocketService } from 'src/app/services/socket.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() allDisplays:Display[];
  @Output() onAddDisplay:EventEmitter<Display> = new EventEmitter();
  @Output() onSaveScreen:EventEmitter<Display> = new EventEmitter();

  faPlus=faPlus
  faBars=faBars
  faSignal=faSignal
  faTriangleExclamation=faTriangleExclamation
  faVolumeHigh=faVolumeHigh
  faVolumeMute= faVolumeMute
  faPlug=faPlug
  faPlugCircleXmark=faPlugCircleXmark
  faFloppyDisk=faFloppyDisk
  faDownload=faDownload
  faTruckMonster=faTruckMonster

  connectionColor:string;
  vehicleConnectionColor:string = "red";
  arduinoConnectionColor:string = "#30ad1a";
  arduinoConnectionIcon:any = faPlug;

  warningColor:string;
  volumeIcon:any = faVolumeMute;
  

  showAddDisplay:boolean = false;
  mute:boolean = true

  constructor(private dialogRef:MatDialog,private settingsService: SettingsService,private socketService: SocketService, private audioService: AudioService) { 
    this.socketService.onConnect().subscribe(() => this.setConnectionStatus(true));
    this.socketService.onDisconect().subscribe(() => this.setConnectionStatus(false));
    this.socketService.onCurrentWarnings().subscribe((show:Boolean)=> this.setWarningStatus(show))
    this.socketService.onArduinoConnectionStatus().subscribe((connected:any)=> this.setArduinoConnectionStatus(connected))
    this.socketService.onVehicleConnectionStatus().subscribe((connected:any)=> this.setVehicleConnectionStatus(connected))
  }

  ngOnInit(): void {
    this.setConnectionStatus(this.socketService.getConnectionSatatus())
  }

  toggleAddDisplay(): void{
    const ref = this.dialogRef.open(AddDisplayComponent,{
      height: '80%',
      width: '50%',
      data: {
        allDisplays: this.allDisplays,
      }
    });

    const sub = ref.componentInstance.onAddDisplay.subscribe((display:Display) => {
      this.addDisplay(display)
    });
  }

  addDisplay(display:Display):void {
    this.onAddDisplay.emit(display);
  }

  toggleSidebar() {
    this.settingsService.toggleSidebar();
  }

  saveScreen() {
    this.onSaveScreen.emit()
  }

  downloadLogs() {
    const link = document.createElement('a');
    
    link.setAttribute('href', ROOT_URL+":3200/logs");
    link.setAttribute('download', 'server_session_logs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  toggleMute() {
    this.mute=!this.mute;
    this.volumeIcon = (this.mute) ? this.faVolumeMute : this.faVolumeHigh
    this.audioService.setMute(this.mute)
  }

  setWarningStatus(show:Boolean) {
    this.warningColor = (show) ? "yellow" : "rgb(62, 71, 90)";
  }

  setVehicleConnectionStatus(connected:boolean) {
    this.vehicleConnectionColor = (connected) ? "#30ad1a" : "red";
    
  }

  setArduinoConnectionStatus(connected:boolean) {
    this.arduinoConnectionIcon = (connected) ? faPlug : faPlugCircleXmark;
    this.arduinoConnectionColor = (connected) ? "#30ad1a" : "red";
  }

  setConnectionStatus(connected:boolean) {
    this.connectionColor = (connected) ? "#30ad1a" : "red";

    //as when lose of conection cant tell if arduino is connected
    this.arduinoConnectionIcon = (connected) ? faPlug : faPlugCircleXmark;
    this.arduinoConnectionColor = (connected) ? "#30ad1a" : "red";
    
    this.vehicleConnectionColor = "red";
  }
  

  
}
