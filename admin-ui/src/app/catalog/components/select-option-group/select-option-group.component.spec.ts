import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClrIconCustomTag } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

import { DataService } from '../../../data/providers/data.service';
import { MockDataService } from '../../../data/providers/data.service.mock';
import { SelectToggleComponent } from '../../../shared/components/select-toggle/select-toggle.component';

import { SelectOptionGroupComponent } from './select-option-group.component';

describe('SelectOptionGroupComponent', () => {
    let component: SelectOptionGroupComponent;
    let fixture: ComponentFixture<SelectOptionGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, TranslateModule.forRoot()],
            declarations: [SelectOptionGroupComponent, SelectToggleComponent, ClrIconCustomTag],
            providers: [{ provide: DataService, useClass: MockDataService }],
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
