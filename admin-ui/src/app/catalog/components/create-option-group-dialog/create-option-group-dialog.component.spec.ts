import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IconCustomTag, Tooltip, TooltipContent, TooltipTrigger } from '@clr/angular';

import { MockTranslatePipe } from '../../../../testing/translate.pipe.mock';
import { DataService } from '../../../data/providers/data.service';
import { MockDataService } from '../../../data/providers/data.service.mock';
import { FormFieldControlDirective } from '../../../shared/components/form-field/form-field-control.directive';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

import { CreateOptionGroupDialogComponent } from './create-option-group-dialog.component';

describe('CreateOptionGroupDialogComponent', () => {
    let component: CreateOptionGroupDialogComponent;
    let fixture: ComponentFixture<CreateOptionGroupDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [
                CreateOptionGroupDialogComponent,
                FormFieldComponent,
                FormFieldControlDirective,
                MockTranslatePipe,
                IconCustomTag,
                TooltipContent,
                TooltipTrigger,
                Tooltip,
            ],
            providers: [{ provide: DataService, useClass: MockDataService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateOptionGroupDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
