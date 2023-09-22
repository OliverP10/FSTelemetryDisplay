import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMovementModesComponent } from './display-movement-modes.component';

describe('DisplayMovementModesComponent', () => {
  let component: DisplayMovementModesComponent;
  let fixture: ComponentFixture<DisplayMovementModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayMovementModesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMovementModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
