import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemArmComponent } from './display-item-arm.component';

describe('DisplayItemArmComponent', () => {
  let component: DisplayItemArmComponent;
  let fixture: ComponentFixture<DisplayItemArmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemArmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemArmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
