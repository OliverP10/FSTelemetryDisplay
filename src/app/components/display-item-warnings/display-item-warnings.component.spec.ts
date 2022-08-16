import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemWarningsComponent } from './display-item-warnings.component';

describe('DisplayItemWarningsComponent', () => {
  let component: DisplayItemWarningsComponent;
  let fixture: ComponentFixture<DisplayItemWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemWarningsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
