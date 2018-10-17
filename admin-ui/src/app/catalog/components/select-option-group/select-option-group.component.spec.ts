import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestingCommonModule } from '../../../../testing/testing-common.module';
import { DataService } from '../../../data/providers/data.service';
import { MockDataService } from '../../../data/providers/data.service.mock';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { SelectToggleComponent } from '../../../shared/components/select-toggle/select-toggle.component';
import { BackgroundColorFromDirective } from '../../../shared/directives/background-color-from.directive';

import { SelectOptionGroupComponent } from './select-option-group.component';

describe('SelectOptionGroupComponent', () => {
    let component: SelectOptionGroupComponent;
    let fixture: ComponentFixture<SelectOptionGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, TestingCommonModule],
            declarations: [
                SelectOptionGroupComponent,
                SelectToggleComponent,
                ChipComponent,
                BackgroundColorFromDirective,
            ],
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
