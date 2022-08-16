import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemLinearComponent } from './display-item-linear.component';

describe('DisplayItemLinearComponent', () => {
  let component: DisplayItemLinearComponent;
  let fixture: ComponentFixture<DisplayItemLinearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemLinearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemLinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
