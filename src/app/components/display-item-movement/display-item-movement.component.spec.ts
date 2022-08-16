import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemMovementComponent } from './display-item-movement.component';

describe('DisplayItemMovementComponent', () => {
  let component: DisplayItemMovementComponent;
  let fixture: ComponentFixture<DisplayItemMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
