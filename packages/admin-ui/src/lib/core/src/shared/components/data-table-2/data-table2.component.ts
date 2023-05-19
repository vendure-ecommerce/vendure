import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
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
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageCode } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { DataTableFilterCollection } from '../../../providers/data-table/data-table-filter-collection';
import { DataTableConfig, LocalStorageService } from '../../../providers/local-storage/local-storage.service';
import { BulkActionMenuComponent } from '../bulk-action-menu/bulk-action-menu.component';

import { DataTable2ColumnComponent } from './data-table-column.component';
import { DataTableCustomFieldColumnComponent } from './data-table-custom-field-column.component';
import { DataTable2SearchComponent } from './data-table-search.component';

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
    selector: 'vdr-data-table-2',
    templateUrl: 'data-table2.component.html',
    styleUrls: ['data-table2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaginationService],
})
export class DataTable2Component<T> implements AfterContentInit, OnChanges, OnInit, OnDestroy {
    @Input() id: string;
    @Input() items: T[];
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalItems: number;
    @Input() emptyStateLabel: string;
    @Input() filters: DataTableFilterCollection;
    @Input() activeIndex = -1;
    @Output() pageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();

    @ContentChildren(DataTable2ColumnComponent) columns: QueryList<DataTable2ColumnComponent<T>>;
    @ContentChildren(DataTableCustomFieldColumnComponent)
    customFieldColumns: QueryList<DataTableCustomFieldColumnComponent<T>>;
    @ContentChild(DataTable2SearchComponent) searchComponent: DataTable2SearchComponent;
    @ContentChild(BulkActionMenuComponent) bulkActionMenuComponent: BulkActionMenuComponent;
    @ContentChild('vdrDt2CustomSearch') customSearchTemplate: TemplateRef<any>;
    @ContentChildren(TemplateRef) templateRefs: QueryList<TemplateRef<any>>;
    rowTemplate: TemplateRef<any>;
    currentStart: number;
    currentEnd: number;
    // This is used to apply a `user-select: none` CSS rule to the table,
    // which allows shift-click multi-row selection
    disableSelect = false;
    showSearchFilterRow = false;
    protected uiLanguage$: Observable<LanguageCode>;
    private subscription: Subscription | undefined;

    constructor(
        protected changeDetectorRef: ChangeDetectorRef,
        protected localStorageService: LocalStorageService,
        protected dataService: DataService,
    ) {
        this.uiLanguage$ = this.dataService.client
            .uiState()
            .stream$.pipe(map(({ uiState }) => uiState.language));
    }

    get selectionManager() {
        return this.bulkActionMenuComponent?.selectionManager;
    }

    get allColumns() {
        return [...(this.columns ?? []), ...(this.customFieldColumns ?? [])];
    }

    get visibleSortedColumns() {
        return this.sortedColumns.filter(c => c.visible);
    }

    get sortedColumns() {
        const columns = this.allColumns;
        const dataTableConfig = this.getDataTableConfig();
        for (const [id, index] of Object.entries(dataTableConfig[this.id].order)) {
            const column = columns.find(c => c.id === id);
            const currentIndex = columns.findIndex(c => c.id === id);
            if (currentIndex !== -1 && column) {
                columns.splice(currentIndex, 1);
                columns.splice(index, 0, column);
            }
        }
        return columns;
    }

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
        this.subscription = this.selectionManager?.selectionChanges$.subscribe(() =>
            this.changeDetectorRef.markForCheck(),
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.currentStart = this.itemsPerPage * (this.currentPage - 1);
            this.currentEnd = this.currentStart + changes.items.currentValue?.length;
            this.selectionManager?.setCurrentItems(this.items);
        }
    }

    ngOnDestroy() {
        if (this.selectionManager) {
            document.removeEventListener('keydown', this.shiftDownHandler);
            document.removeEventListener('keyup', this.shiftUpHandler);
        }
        this.subscription?.unsubscribe();
    }

    ngAfterContentInit(): void {
        this.rowTemplate = this.templateRefs.last;
        const dataTableConfig = this.localStorageService.get('dataTableConfig') ?? {};

        if (!this.id) {
            console.warn(`No id was assigned to the data table component`);
        }
        const updateColumnVisibility = () => {
            if (!dataTableConfig[this.id]) {
                dataTableConfig[this.id] = { visibility: [], order: {}, showSearchFilterRow: false };
            }
            dataTableConfig[this.id].visibility = this.allColumns
                .filter(c => (c.visible && c.hiddenByDefault) || (!c.visible && !c.hiddenByDefault))
                .map(c => c.id);
            this.localStorageService.set('dataTableConfig', dataTableConfig);
        };

        this.allColumns.forEach(column => {
            if (dataTableConfig?.[this.id]?.visibility.includes(column.id)) {
                column.setVisibility(column.hiddenByDefault);
            }
            column.onColumnChange(updateColumnVisibility);
        });

        if (this.selectionManager) {
            document.addEventListener('keydown', this.shiftDownHandler, { passive: true });
            document.addEventListener('keyup', this.shiftUpHandler, { passive: true });
            this.bulkActionMenuComponent.onClearSelection(() => {
                this.changeDetectorRef.markForCheck();
            });
        }
        this.showSearchFilterRow = dataTableConfig?.[this.id]?.showSearchFilterRow ?? false;
    }

    onColumnReorder(event: { column: DataTable2ColumnComponent<any>; newIndex: number }) {
        const naturalIndex = this.allColumns.findIndex(c => c.id === event.column.id);
        const dataTableConfig = this.getDataTableConfig();
        if (naturalIndex === event.newIndex) {
            delete dataTableConfig[this.id].order[event.column.id];
        } else {
            dataTableConfig[this.id].order[event.column.id] = event.newIndex;
        }
        this.localStorageService.set('dataTableConfig', dataTableConfig);
    }

    onColumnsReset() {
        const dataTableConfig = this.getDataTableConfig();
        dataTableConfig[this.id].order = {};
        dataTableConfig[this.id].visibility = [];
        this.localStorageService.set('dataTableConfig', dataTableConfig);
    }

    toggleSearchFilterRow() {
        this.showSearchFilterRow = !this.showSearchFilterRow;
        const dataTableConfig = this.getDataTableConfig();
        dataTableConfig[this.id].showSearchFilterRow = this.showSearchFilterRow;
        this.localStorageService.set('dataTableConfig', dataTableConfig);
    }

    trackByFn(index: number, item: any) {
        if ((item as any).id != null) {
            return (item as any).id;
        } else {
            return index;
        }
    }

    onToggleAllClick() {
        this.selectionManager?.toggleSelectAll();
    }

    onRowClick(item: T, event: MouseEvent) {
        this.selectionManager?.toggleSelection(item, event);
    }

    private getDataTableConfig(): DataTableConfig {
        const dataTableConfig = this.localStorageService.get('dataTableConfig') ?? {};
        if (!dataTableConfig[this.id]) {
            dataTableConfig[this.id] = { visibility: [], order: {}, showSearchFilterRow: false };
        }
        return dataTableConfig;
    }
}
