import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
    let component: ActionBarComponent;
    let fixture: ComponentFixture<ActionBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActionBarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
