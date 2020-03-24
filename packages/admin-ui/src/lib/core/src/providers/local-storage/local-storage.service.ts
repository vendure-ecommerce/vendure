import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

export type LocalStorageKey = 'activeChannelToken' | 'authToken' | 'uiLanguageCode';
export type LocalStorageLocationBasedKey = 'shippingTestOrder' | 'shippingTestAddress';
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
    public set(key: LocalStorageKey, value: any): void {
        const keyName = this.keyName(key);
        localStorage.setItem(keyName, JSON.stringify(value));
    }

    /**
     * Set a key-value pair specific to the current location (url)
     */
    public setForCurrentLocation(key: LocalStorageLocationBasedKey, value: any) {
        const compositeKey = this.getLocationBasedKey(key);
        this.set(compositeKey as any, value);
    }

    /**
     * Set a key-value pair in the browser's SessionStorage
     */
    public setForSession(key: LocalStorageKey, value: any): void {
        const keyName = this.keyName(key);
        sessionStorage.setItem(keyName, JSON.stringify(value));
    }

    /**
     * Get the value of the given key from the SessionStorage or LocalStorage.
     */
    public get(key: LocalStorageKey): any {
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
    public getForCurrentLocation(key: LocalStorageLocationBasedKey): any {
        const compositeKey = this.getLocationBasedKey(key);
        return this.get(compositeKey as any);
    }

    public remove(key: LocalStorageKey): void {
        const keyName = this.keyName(key);
        sessionStorage.removeItem(keyName);
        localStorage.removeItem(keyName);
    }

    private getLocationBasedKey(key: string) {
        const path = this.location.path();
        return key + path;
    }

    private keyName(key: LocalStorageKey): string {
        return PREFIX + key;
    }
}
