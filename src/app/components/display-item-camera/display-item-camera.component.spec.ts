import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemCameraComponent } from './display-item-camera.component';

describe('DisplayItemCameraComponent', () => {
  let component: DisplayItemCameraComponent;
  let fixture: ComponentFixture<DisplayItemCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
