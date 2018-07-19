import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionGroupComponent } from './select-option-group.component';

describe('SelectOptionGroupComponent', () => {
    let component: SelectOptionGroupComponent;
    let fixture: ComponentFixture<SelectOptionGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectOptionGroupComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectOptionGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
