import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemArmModesComponent } from './display-arm-modes.component';

describe('DisplayItemArmModesComponent', () => {
    let component: DisplayItemArmModesComponent;
    let fixture: ComponentFixture<DisplayItemArmModesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayItemArmModesComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DisplayItemArmModesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
