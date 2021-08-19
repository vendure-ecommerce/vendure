import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { DataService } from './data/providers/data.service';
import { ServerConfigService } from './data/server-config';
import { LocalStorageService } from './providers/local-storage/local-storage.service';

@Component({
    selector: 'vdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loading$: Observable<boolean>;
    private _document?: Document;

    constructor(
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
        private localStorageService: LocalStorageService,
        @Inject(DOCUMENT) private document?: any,
    ) {
        this._document = document;
    }

    ngOnInit() {
        this.loading$ = this.dataService.client
            .getNetworkStatus()
            .stream$.pipe(map(data => 0 < data.networkStatus.inFlightRequests));

        this.dataService.client
            .uiState()
            .mapStream(data => data.uiState.theme)
            .subscribe(theme => {
                this._document?.body.setAttribute('data-theme', theme);
            });

        // Once logged in, keep the localStorage "contentLanguageCode" in sync with the
        // uiState. Also perform a check to ensure that the current contentLanguage is
        // one of the availableLanguages per GlobalSettings.
        this.dataService.client
            .userStatus()
            .mapStream(({ userStatus }) => userStatus.isLoggedIn)
            .pipe(
                filter(loggedIn => loggedIn === true),
                switchMap(() => {
                    return this.dataService.client.uiState().mapStream(data => data.uiState.contentLanguage);
                }),
                switchMap(contentLang => {
                    return this.serverConfigService
                        .getAvailableLanguages()
                        .pipe(map(available => [contentLang, available] as const));
                }),
            )
            .subscribe({
                next: ([contentLanguage, availableLanguages]) => {
                    this.localStorageService.set('contentLanguageCode', contentLanguage);
                    if (availableLanguages.length && !availableLanguages.includes(contentLanguage)) {
                        this.dataService.client.setContentLanguage(availableLanguages[0]).subscribe();
                    }
                },
            });
    }
}
