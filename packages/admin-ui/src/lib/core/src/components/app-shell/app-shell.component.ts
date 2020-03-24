import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { LanguageCode } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { I18nService } from '../../providers/i18n/i18n.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';
import { ModalService } from '../../providers/modal/modal.service';
import { UiLanguageSwitcherDialogComponent } from '../ui-language-switcher-dialog/ui-language-switcher-dialog.component';

@Component({
    selector: 'vdr-app-shell',
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
    userName$: Observable<string>;
    uiLanguage$: Observable<LanguageCode>;
    availableLanguages: LanguageCode[] = [];

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private router: Router,
        private i18nService: I18nService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
        this.userName$ = this.dataService.client
            .userStatus()
            .single$.pipe(map(data => data.userStatus.username));
        this.uiLanguage$ = this.dataService.client.uiState().stream$.pipe(map(data => data.uiState.language));
        this.availableLanguages = this.i18nService.availableLanguages;
    }

    selectUiLanguage() {
        this.uiLanguage$
            .pipe(
                take(1),
                switchMap(currentLanguage =>
                    this.modalService.fromComponent(UiLanguageSwitcherDialogComponent, {
                        closable: true,
                        size: 'sm',
                        locals: {
                            availableLanguages: this.availableLanguages,
                            currentLanguage,
                        },
                    }),
                ),
                switchMap(value => (value ? this.dataService.client.setUiLanguage(value) : EMPTY)),
            )
            .subscribe(result => {
                if (result.setUiLanguage) {
                    this.i18nService.setLanguage(result.setUiLanguage);
                    this.localStorageService.set('uiLanguageCode', result.setUiLanguage);
                }
            });
    }

    logOut() {
        this.authService.logOut().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
