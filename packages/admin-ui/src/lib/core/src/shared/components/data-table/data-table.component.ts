import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
} from '@angular/core';
import { PaginationService } from 'ngx-pagination';

import { DataTableColumnComponent } from './data-table-column.component';

/**
 * @description
 * A table for displaying PaginatedList results. It is designed to be used inside components which
 * extend the {@link BaseListComponent} class.
 *
 * @example
 * ```HTML
 * <vdr-data-table
 *   [items]="items$ | async"
 *   [itemsPerPage]="itemsPerPage$ | async"
 *   [totalItems]="totalItems$ | async"
 *   [currentPage]="currentPage$ | async"
 *   (pageChange)="setPageNumber($event)"
 *   (itemsPerPageChange)="setItemsPerPage($event)"
 * >
 *   <!-- The header columns are defined first -->
 *   <vdr-dt-column>{{ 'common.name' | translate }}</vdr-dt-column>
 *   <vdr-dt-column></vdr-dt-column>
 *   <vdr-dt-column></vdr-dt-column>
 *
 *   <!-- Then we define how a row is rendered -->
 *   <ng-template let-taxRate="item">
 *     <td class="left align-middle">{{ taxRate.name }}</td>
 *     <td class="left align-middle">{{ taxRate.category.name }}</td>
 *     <td class="left align-middle">{{ taxRate.zone.name }}</td>
 *     <td class="left align-middle">{{ taxRate.value }}%</td>
 *     <td class="right align-middle">
 *       <vdr-table-row-action
 *         iconShape="edit"
 *         [label]="'common.edit' | translate"
 *         [linkTo]="['./', taxRate.id]"
 *       ></vdr-table-row-action>
 *     </td>
 *     <td class="right align-middle">
 *       <vdr-dropdown>
 *         <button type="button" class="btn btn-link btn-sm" vdrDropdownTrigger>
 *           {{ 'common.actions' | translate }}
 *           <clr-icon shape="caret down"></clr-icon>
 *         </button>
 *         <vdr-dropdown-menu vdrPosition="bottom-right">
 *           <button
 *               type="button"
 *               class="delete-button"
 *               (click)="deleteTaxRate(taxRate)"
 *               [disabled]="!(['DeleteSettings', 'DeleteTaxRate'] | hasPermission)"
 *               vdrDropdownItem
 *           >
 *               <clr-icon shape="trash" class="is-danger"></clr-icon>
 *               {{ 'common.delete' | translate }}
 *           </button>
 *         </vdr-dropdown-menu>
 *       </vdr-dropdown>
 *     </td>
 *   </ng-template>
 * </vdr-data-table>
 * ```
 *
 * @docsCategory components
 */
@Component({
    selector: 'vdr-data-table',
    templateUrl: 'data-table.component.html',
    styleUrls: ['data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaginationService],
})
export class DataTableComponent<T> implements AfterContentInit, OnChanges, OnInit, OnDestroy {
    @Input() items: T[];
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalItems: number;
    @Input() allSelected: boolean;
    @Input() isRowSelectedFn: (item: T) => boolean;
    @Input() emptyStateLabel: string;
    @Output() allSelectChange = new EventEmitter<void>();
    @Output() rowSelectChange = new EventEmitter<{ event: MouseEvent; item: T }>();
    @Output() pageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();
    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
    @ContentChildren(TemplateRef) templateRefs: QueryList<TemplateRef<any>>;
    rowTemplate: TemplateRef<any>;
    currentStart: number;
    currentEnd: number;
    // This is used to apply a `user-select: none` CSS rule to the table,
    // which allows shift-click multi-row selection
    disableSelect = false;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    private shiftDownHandler = (event: KeyboardEvent) => {
        if (event.shiftKey && !this.disableSelect) {
            this.disableSelect = true;
            this.changeDetectorRef.markForCheck();
        }
    };

    private shiftUpHandler = (event: KeyboardEvent) => {
        if (this.disableSelect) {
            this.disableSelect = false;
            this.changeDetectorRef.markForCheck();
        }
    };

    ngOnInit() {
        if (typeof this.isRowSelectedFn === 'function') {
            document.addEventListener('keydown', this.shiftDownHandler, { passive: true });
            document.addEventListener('keyup', this.shiftUpHandler, { passive: true });
        }
    }

    ngOnDestroy() {
        if (typeof this.isRowSelectedFn === 'function') {
            document.removeEventListener('keydown', this.shiftDownHandler);
            document.removeEventListener('keyup', this.shiftUpHandler);
        }
    }

    ngAfterContentInit(): void {
        this.rowTemplate = this.templateRefs.last;
    }

    trackByFn(index: number, item: any) {
        if ((item as any).id != null) {
            return (item as any).id;
        } else {
            return index;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.currentStart = this.itemsPerPage * (this.currentPage - 1);
            this.currentEnd = this.currentStart + changes.items.currentValue?.length;
        }
    }
}
