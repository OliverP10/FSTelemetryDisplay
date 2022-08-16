import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemRadialComponent } from './display-item-radial.component';

describe('DisplayItemRadialComponent', () => {
  let component: DisplayItemRadialComponent;
  let fixture: ComponentFixture<DisplayItemRadialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemRadialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemRadialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
