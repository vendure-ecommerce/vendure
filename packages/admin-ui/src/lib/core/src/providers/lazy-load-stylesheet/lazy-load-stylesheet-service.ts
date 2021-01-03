import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LazyLoadStylesheetService {
    constructor(@Inject(DOCUMENT) private document: any) {}

    /**
     * Lazy load a stylesheet on document header.
     */
    loadStylesheet(stylesheetPath) {
        return new Promise(async resolve => {
            const styleElement = document.createElement('link');

            styleElement.rel = 'stylesheet';
            styleElement.href = stylesheetPath;
            styleElement.onload = resolve;

            document.head.appendChild(styleElement);
        });
    }
}
