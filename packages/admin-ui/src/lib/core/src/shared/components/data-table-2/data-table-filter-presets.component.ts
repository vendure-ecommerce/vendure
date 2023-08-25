import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { DataTableFilterCollection } from '../../../providers/data-table/data-table-filter-collection';
import { FilterPresetService } from './filter-preset.service';

@Component({
    selector: 'vdr-data-table-filter-presets',
    templateUrl: './data-table-filter-presets.component.html',
    styleUrls: ['./data-table-filter-presets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFilterPresetsComponent implements OnInit, OnDestroy {
    @Input({ required: true }) dataTableId: string;
    @Input({ required: true }) filters: DataTableFilterCollection;
    serializedActiveFilters: string;
    filterPresets$: Observable<Array<{ name: string; value: string }>>;

    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private filterPresetService: FilterPresetService) {}
    ngOnInit() {
        this.route.queryParamMap
            .pipe(
                map(qpm => qpm.get('filters')),
                distinctUntilChanged(),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.serializedActiveFilters = this.filters.serialize();
            });
        this.serializedActiveFilters = this.filters.serialize();

        this.filterPresets$ = this.filterPresetService.presetChanges$.pipe(
            startWith(this.filterPresetService.getFilterPresets(this.dataTableId)),
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    deleteFilterPreset(name: string) {
        this.filterPresetService.deleteFilterPreset({
            dataTableId: this.dataTableId,
            name,
        });
        this.serializedActiveFilters = this.filters.serialize();
    }
}
