import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestingCommonModule } from '../../../../testing/testing-common.module';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { MockNotificationService } from '../../../core/providers/notification/notification.service.mock';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { CurrencyInputComponent } from '../../../shared/components/currency-input/currency-input.component';
import { SelectToggleComponent } from '../../../shared/components/select-toggle/select-toggle.component';
import { CreateOptionGroupFormComponent } from '../create-option-group-form/create-option-group-form.component';
import { SelectOptionGroupComponent } from '../select-option-group/select-option-group.component';

import { ProductVariantsWizardComponent } from './product-variants-wizard.component';

describe('ProductVariantsWizardComponent', () => {
    let component: ProductVariantsWizardComponent;
    let fixture: ComponentFixture<ProductVariantsWizardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TestingCommonModule, ReactiveFormsModule, FormsModule],
            declarations: [
                ProductVariantsWizardComponent,
                SelectOptionGroupComponent,
                CreateOptionGroupFormComponent,
                SelectToggleComponent,
                ChipComponent,
                CurrencyInputComponent,
            ],
            providers: [{ provide: NotificationService, useClass: MockNotificationService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductVariantsWizardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
