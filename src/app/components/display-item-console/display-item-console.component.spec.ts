import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemConsoleComponent } from './display-item-console.component';

describe('DisplayItemConsoleComponent', () => {
  let component: DisplayItemConsoleComponent;
  let fixture: ComponentFixture<DisplayItemConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
