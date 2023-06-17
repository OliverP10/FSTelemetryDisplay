import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayKeyboardControlComponent } from './display-keyboard-control.component';

describe('DisplayKeyboardControlComponent', () => {
  let component: DisplayKeyboardControlComponent;
  let fixture: ComponentFixture<DisplayKeyboardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayKeyboardControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayKeyboardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
