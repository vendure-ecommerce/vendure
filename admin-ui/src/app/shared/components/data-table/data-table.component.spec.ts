import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';

import { TestingCommonModule } from '../../../../testing/testing-common.module';
import { ItemsPerPageControlsComponent } from '../items-per-page-controls/items-per-page-controls.component';
import { PaginationControlsComponent } from '../pagination-controls/pagination-controls.component';

import { DataTableColumnComponent } from './data-table-column.component';
import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
    let component: DataTableComponent;
    let fixture: ComponentFixture<DataTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxPaginationModule, TestingCommonModule],
            declarations: [
                DataTableComponent,
                DataTableColumnComponent,
                PaginationControlsComponent,
                ItemsPerPageControlsComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
