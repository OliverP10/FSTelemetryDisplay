import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemDataComponent } from './display-item-data.component';

describe('DisplayItemDataComponent', () => {
  let component: DisplayItemDataComponent;
  let fixture: ComponentFixture<DisplayItemDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
