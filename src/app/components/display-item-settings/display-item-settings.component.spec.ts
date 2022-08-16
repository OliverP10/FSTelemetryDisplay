import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemSettingsComponent } from './display-item-settings.component';

describe('DisplayItemSettingsComponent', () => {
  let component: DisplayItemSettingsComponent;
  let fixture: ComponentFixture<DisplayItemSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
