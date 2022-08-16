import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDisplayFormComponent } from './create-display-form.component';

describe('CreateDisplayFormComponent', () => {
  let component: CreateDisplayFormComponent;
  let fixture: ComponentFixture<CreateDisplayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDisplayFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDisplayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
