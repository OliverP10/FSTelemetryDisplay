import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemClawComponent } from './display-item-claw.component';

describe('DisplayItemClawComponent', () => {
  let component: DisplayItemClawComponent;
  let fixture: ComponentFixture<DisplayItemClawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemClawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemClawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
