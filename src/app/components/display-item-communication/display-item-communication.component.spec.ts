import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemCommunicationComponent } from './display-item-communication.component';

describe('DisplayItemCommunicationComponent', () => {
  let component: DisplayItemCommunicationComponent;
  let fixture: ComponentFixture<DisplayItemCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
