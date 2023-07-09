import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySensorMonitoringComponent } from './display-sensor-monitoring.component';

describe('DisplaySensorMonitoringComponent', () => {
  let component: DisplaySensorMonitoringComponent;
  let fixture: ComponentFixture<DisplaySensorMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySensorMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaySensorMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
