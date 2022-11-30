import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAnalysisGraphComponent } from './display-analysis-graph.component';

describe('DisplayAnalysisGraphComponent', () => {
  let component: DisplayAnalysisGraphComponent;
  let fixture: ComponentFixture<DisplayAnalysisGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAnalysisGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAnalysisGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
