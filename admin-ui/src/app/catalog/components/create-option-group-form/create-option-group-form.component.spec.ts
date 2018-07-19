import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOptionGroupFormComponent } from './create-option-group-form.component';

describe('CreateOptionGroupFormComponent', () => {
    let component: CreateOptionGroupFormComponent;
    let fixture: ComponentFixture<CreateOptionGroupFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateOptionGroupFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateOptionGroupFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
