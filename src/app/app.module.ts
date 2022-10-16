import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GaugesModule } from 'ng-canvas-gauges';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ViewSelectorComponent } from './components/view-selector/view-selector.component';
import { ScreensComponent } from './components/screens/screens.component';
import { AddDisplayComponent } from './components/add-display/add-display.component';
import { DisplayItemGraphComponent } from './components/display-item-graph/display-item-graph.component';
import { DisplayItemLinearComponent } from './components/display-item-linear/display-item-linear.component';
import { DisplayItemRadialComponent } from './components/display-item-radial/display-item-radial.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScreenItemComponent } from './components/screen-item/screen-item.component';
import { DisplayItemSettingsComponent } from './components/display-item-settings/display-item-settings.component';
import { environment } from 'src/environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateDisplayFormComponent } from './components/create-display-form/create-display-form.component';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSliderModule } from '@angular/material/slider';

import { DisplayItemMapComponent } from './components/display-item-map/display-item-map.component';
import { DisplayItemWarningsComponent } from './components/display-item-warnings/display-item-warnings.component';
import { DisplayItemCameraComponent } from './components/display-item-camera/display-item-camera.component';
import { DisplayItemCommunicationComponent } from './components/display-item-communication/display-item-communication.component';
import { DisplayItemArmComponent } from './components/display-item-arm/display-item-arm.component';
import { DisplayItemDataComponent } from './components/display-item-data/display-item-data.component';
import { DisplayItemMovementComponent } from './components/display-item-movement/display-item-movement.component';
import { DisplayItemArmModesComponent } from './components/display-item-arm-modes/display-item-arm-modes.component';
import { DisplayItemClawComponent } from './components/display-item-claw/display-item-claw.component';
import { DisplayItemConsoleComponent } from './components/display-item-console/display-item-console.component';
import { DisplayGraphComponent } from './components/display-graph/display-graph.component';

const appRoutes: Routes = [
    { path: '', component: ScreensComponent },
    { path: 'about', component: AboutComponent },
    { path: 'create-display', component: CreateDisplayFormComponent }
];

const config: SocketIoConfig = {
    url: environment.ROOT_URL + environment.SOCKET_PORT, // socket server url;
    options: {
        transports: ['websocket']
    }
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ViewSelectorComponent,
        ScreensComponent,
        AddDisplayComponent,
        DisplayItemGraphComponent,
        DisplayItemLinearComponent,
        DisplayItemRadialComponent,
        ScreenItemComponent,
        DisplayItemSettingsComponent,
        AboutComponent,
        CreateDisplayFormComponent,
        DisplayItemMapComponent,
        DisplayItemWarningsComponent,
        DisplayItemCameraComponent,
        DisplayItemCommunicationComponent,
        DisplayItemArmComponent,
        DisplayItemDataComponent,
        DisplayItemMovementComponent,
        DisplayItemArmModesComponent,
        DisplayItemClawComponent,
        DisplayItemConsoleComponent,
        DisplayGraphComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatGridListModule,
        FontAwesomeModule,
        SocketIoModule.forRoot(config),
        GaugesModule,
        RouterModule.forRoot(appRoutes),
        MatDialogModule,
        MatSidenavModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatChipsModule,
        MatSnackBarModule,
        MatTableModule,
        MatSortModule,
        HttpClientModule,
        MatSliderModule,
        HighchartsChartModule,
        DragDropModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
