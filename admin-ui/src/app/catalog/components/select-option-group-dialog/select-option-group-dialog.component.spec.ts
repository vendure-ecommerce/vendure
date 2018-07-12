import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClrIconCustomTag } from '@clr/angular';

import { MockTranslatePipe } from '../../../../testing/translate.pipe.mock';
import { DataService } from '../../../data/providers/data.service';
import { MockDataService } from '../../../data/providers/data.service.mock';

import { SelectOptionGroupDialogComponent } from './select-option-group-dialog.component';

describe('SelectOptionGroupDialogComponent', () => {
    let component: SelectOptionGroupDialogComponent;
    let fixture: ComponentFixture<SelectOptionGroupDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SelectOptionGroupDialogComponent, ClrIconCustomTag, MockTranslatePipe],
            providers: [{ provide: DataService, useClass: MockDataService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectOptionGroupDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
