import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { getAppConfig } from '../../app.config';
import { LanguageCode } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { BreadcrumbService } from '../../providers/breadcrumb/breadcrumb.service';
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
    uiLanguageAndLocale$: Observable<[LanguageCode, string | undefined]>;
    direction$: Observable<'ltr' | 'rtl'>;
    availableLanguages: LanguageCode[] = [];
    hideVendureBranding = getAppConfig().hideVendureBranding;
    pageTitle$: Observable<string>;
    mainNavExpanded$: Observable<boolean>;

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private router: Router,
        private i18nService: I18nService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private breadcrumbService: BreadcrumbService,
    ) {}

    ngOnInit() {
        this.userName$ = this.dataService.client
            .userStatus()
            .single$.pipe(map(data => data.userStatus.username));
        this.uiLanguageAndLocale$ = this.dataService.client
            .uiState()
            .stream$.pipe(map(({ uiState }) => [uiState.language, uiState.locale ?? undefined]));
        this.availableLanguages = this.i18nService.availableLanguages;
        this.pageTitle$ = this.breadcrumbService.breadcrumbs$.pipe(
            map(breadcrumbs => breadcrumbs[breadcrumbs.length - 1].label),
        );
        this.mainNavExpanded$ = this.dataService.client
            .uiState()
            .stream$.pipe(map(({ uiState }) => uiState.mainNavExpanded));
        this.direction$ = this.uiLanguageAndLocale$.pipe(
            map(([languageCode]) => (this.i18nService.isRTL(languageCode) ? 'rtl' : 'ltr')),
        );
    }

    selectUiLanguage() {
        this.uiLanguageAndLocale$
            .pipe(
                take(1),
                switchMap(([currentLanguage, currentLocale]) =>
                    this.modalService.fromComponent(UiLanguageSwitcherDialogComponent, {
                        closable: true,
                        size: 'lg',
                        locals: {
                            availableLanguages: this.availableLanguages,
                            currentLanguage,
                            currentLocale,
                        },
                    }),
                ),
                switchMap(result =>
                    result ? this.dataService.client.setUiLanguage(result[0], result[1]) : EMPTY,
                ),
            )
            .subscribe(result => {
                if (result.setUiLanguage) {
                    this.i18nService.setLanguage(result.setUiLanguage);
                    this.localStorageService.set('uiLanguageCode', result.setUiLanguage);
                    this.localStorageService.set('uiLocale', result.setUiLocale ?? undefined);
                }
            });
    }

    expandNav() {
        this.dataService.client.setMainNavExpanded(true).subscribe();
    }

    collapseNav() {
        this.dataService.client.setMainNavExpanded(false).subscribe();
    }

    logOut() {
        this.authService.logOut().subscribe(() => {
            const { loginUrl } = getAppConfig();
            if (loginUrl) {
                window.location.href = loginUrl;
            } else {
                this.router.navigate(['/login']);
            }
        });
    }
}
