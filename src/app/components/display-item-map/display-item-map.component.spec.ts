import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemMapComponent } from './display-item-map.component';

describe('DisplayItemMapComponent', () => {
  let component: DisplayItemMapComponent;
  let fixture: ComponentFixture<DisplayItemMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
