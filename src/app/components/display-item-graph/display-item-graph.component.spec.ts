import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemGraphComponent } from './display-item-graph.component';

describe('DisplayItemGraphComponent', () => {
  let component: DisplayItemGraphComponent;
  let fixture: ComponentFixture<DisplayItemGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
