import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisplayComponent } from './create-display.component';

describe('CreateDisplayComponent', () => {
  let component: CreateDisplayComponent;
  let fixture: ComponentFixture<CreateDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
