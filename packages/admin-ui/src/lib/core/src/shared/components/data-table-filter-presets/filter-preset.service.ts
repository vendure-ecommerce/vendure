import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataTableConfig, LocalStorageService } from '../../../providers/local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class FilterPresetService {
    presetChanges$: Observable<Array<{ name: string; value: string }>>;
    private _presetChanges = new Subject<Array<{ name: string; value: string }>>();

    constructor(private localStorageService: LocalStorageService) {
        this.presetChanges$ = this._presetChanges.asObservable();
    }

    protected getDataTableConfig(dataTableId: string): DataTableConfig {
        const dataTableConfig = this.localStorageService.get('dataTableConfig') ?? {};
        if (!dataTableConfig[dataTableId]) {
            dataTableConfig[dataTableId] = {
                visibility: [],
                order: {},
                showSearchFilterRow: false,
                filterPresets: [],
            };
        }
        return dataTableConfig;
    }

    getFilterPresets(dataTableId: string): Array<{ name: string; value: string }> {
        const dataTableConfig = this.getDataTableConfig(dataTableId);
        return dataTableConfig[dataTableId].filterPresets ?? [];
    }

    saveFilterPreset(config: { dataTableId: string; name: string; value: string }) {
        const dataTableConfig = this.getDataTableConfig(config.dataTableId);
        const filterPresets = dataTableConfig[config.dataTableId].filterPresets ?? [];
        const existingName = filterPresets.find(p => p.name === config.name);
        if (existingName) {
            existingName.value = config.value;
        } else {
            filterPresets.push({
                name: config.name,
                value: config.value,
            });
        }
        dataTableConfig[config.dataTableId].filterPresets = filterPresets;
        this.localStorageService.set('dataTableConfig', dataTableConfig);
        this._presetChanges.next(filterPresets);
    }

    deleteFilterPreset(config: { dataTableId: string; name: string }) {
        const dataTableConfig = this.getDataTableConfig(config.dataTableId);
        dataTableConfig[config.dataTableId].filterPresets = dataTableConfig[
            config.dataTableId
        ].filterPresets.filter(p => p.name !== config.name);
        this.localStorageService.set('dataTableConfig', dataTableConfig);
        this._presetChanges.next(dataTableConfig[config.dataTableId].filterPresets);
    }

    reorderPresets(dataTableId: string, fromIndex: number, toIndex: number) {
        const presets = this.getFilterPresets(dataTableId);
        moveItemInArray(presets, fromIndex, toIndex);
        const dataTableConfig = this.getDataTableConfig(dataTableId);
        dataTableConfig[dataTableId].filterPresets = presets;
        this.localStorageService.set('dataTableConfig', dataTableConfig);
        this._presetChanges.next(presets);
    }

    renameFilterPreset(config: { dataTableId: string; oldName: string; newName: string }) {
        const dataTableConfig = this.getDataTableConfig(config.dataTableId);
        const filterPresets = dataTableConfig[config.dataTableId].filterPresets ?? [];
        const existingName = filterPresets.find(p => p.name === config.oldName);
        if (existingName) {
            existingName.name = config.newName;
            dataTableConfig[config.dataTableId].filterPresets = filterPresets;
            this.localStorageService.set('dataTableConfig', dataTableConfig);
            this._presetChanges.next(filterPresets);
        }
    }
}
