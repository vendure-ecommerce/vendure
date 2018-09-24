import { Injectable } from '@angular/core';

export type LocalStorageKey = 'refreshToken' | 'authToken' | 'activeChannelToken';
const PREFIX = 'vnd_';

/**
 * Wrapper around the browser's LocalStorage / SessionStorage object, for persisting data to the browser.
 */
@Injectable()
export class LocalStorageService {
    /**
     * Set a key-value pair in the browser's LocalStorage
     */
    public set(key: LocalStorageKey, value: any): void {
        const keyName = this.keyName(key);
        localStorage.setItem(keyName, JSON.stringify(value));
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

    public remove(key: LocalStorageKey): void {
        const keyName = this.keyName(key);
        sessionStorage.removeItem(keyName);
        localStorage.removeItem(keyName);
    }

    private keyName(key: LocalStorageKey): string {
        return PREFIX + key;
    }
}
