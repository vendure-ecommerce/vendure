import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { LanguageCode } from '../../common/generated-types';
import { WidgetLayoutDefinition } from '../dashboard-widget/dashboard-widget-types';

export type LocalStorageTypeMap = {
    activeChannelToken: string;
    authToken: string;
    uiLanguageCode: LanguageCode;
    contentLanguageCode: LanguageCode;
    orderListLastCustomFilters: any;
    dashboardWidgetLayout: WidgetLayoutDefinition;
    activeTheme: string;
};

export type LocalStorageLocationBasedTypeMap = {
    shippingTestOrder: any;
    shippingTestAddress: any;
};

const PREFIX = 'vnd_';

/**
 * Wrapper around the browser's LocalStorage / SessionStorage object, for persisting data to the browser.
 */
@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor(private location: Location) {}
    /**
     * Set a key-value pair in the browser's LocalStorage
     */
    public set<K extends keyof LocalStorageTypeMap>(key: K, value: LocalStorageTypeMap[K]): void {
        const keyName = this.keyName(key);
        localStorage.setItem(keyName, JSON.stringify(value));
    }

    /**
     * Set a key-value pair specific to the current location (url)
     */
    public setForCurrentLocation<K extends keyof LocalStorageLocationBasedTypeMap>(
        key: K,
        value: LocalStorageLocationBasedTypeMap[K],
    ) {
        const compositeKey = this.getLocationBasedKey(key);
        this.set(compositeKey as any, value);
    }

    /**
     * Set a key-value pair in the browser's SessionStorage
     */
    public setForSession<K extends keyof LocalStorageTypeMap>(key: K, value: LocalStorageTypeMap[K]): void {
        const keyName = this.keyName(key);
        sessionStorage.setItem(keyName, JSON.stringify(value));
    }

    /**
     * Get the value of the given key from the SessionStorage or LocalStorage.
     */
    public get<K extends keyof LocalStorageTypeMap>(key: K): LocalStorageTypeMap[K] | null {
        const keyName = this.keyName(key);
        const item = sessionStorage.getItem(keyName) || localStorage.getItem(keyName);
        let result: any;
        try {
            result = JSON.parse(item || 'null');
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(`Could not parse the localStorage value for "${key}" (${item})`);
        }
        return result;
    }

    /**
     * Get the value of the given key for the current location (url)
     */
    public getForCurrentLocation<K extends keyof LocalStorageLocationBasedTypeMap>(
        key: K,
    ): LocalStorageLocationBasedTypeMap[K] {
        const compositeKey = this.getLocationBasedKey(key);
        return this.get(compositeKey as any);
    }

    public remove(key: keyof LocalStorageTypeMap): void {
        const keyName = this.keyName(key);
        sessionStorage.removeItem(keyName);
        localStorage.removeItem(keyName);
    }

    private getLocationBasedKey(key: string) {
        const path = this.location.path();
        return key + path;
    }

    private keyName(key: keyof LocalStorageTypeMap): string {
        return PREFIX + key;
    }
}
