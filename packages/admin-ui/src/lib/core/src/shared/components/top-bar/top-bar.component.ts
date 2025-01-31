import { Component, isDevMode } from '@angular/core';
import {
    AuthService,
    BreadcrumbService,
    DataService,
    getAppConfig,
    I18nService,
    LanguageCode,
    LocalizationDirectionType,
    LocalizationLanguageCodeType,
    LocalizationService,
    LocalStorageService,
    ModalService,
    UiLanguageSwitcherDialogComponent,
} from '@vendure/admin-ui/core';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-top-bar',
    templateUrl: './top-bar.component.html',
})
export default class TopBarComponent {
    userName$: Observable<string>;
    uiLanguageAndLocale$: LocalizationLanguageCodeType;
    direction$: LocalizationDirectionType;
    availableLanguages: LanguageCode[] = [];
    availableLocales: string[] = [];
    pageTitle$: Observable<string>;
    mainNavExpanded$: Observable<boolean>;
    devMode = isDevMode();

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private router: Router,
        private i18nService: I18nService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private breadcrumbService: BreadcrumbService,
        private localizationService: LocalizationService,
    ) {}

    ngOnInit() {
        this.direction$ = this.localizationService.direction$;

        this.uiLanguageAndLocale$ = this.localizationService.uiLanguageAndLocale$;

        this.userName$ = this.dataService.client
            .userStatus()
            .single$.pipe(map(data => data.userStatus.username));

        this.availableLanguages = this.i18nService.availableLanguages;

        this.availableLocales = this.i18nService.availableLocales;

        this.pageTitle$ = this.breadcrumbService.breadcrumbs$.pipe(
            map(breadcrumbs => breadcrumbs[breadcrumbs.length - 1].label),
        );

        this.mainNavExpanded$ = this.dataService.client
            .uiState()
            .stream$.pipe(map(({ uiState }) => uiState.mainNavExpanded));
    }

    selectUiLanguage() {
        this.uiLanguageAndLocale$
            .pipe(
                take(1),
                switchMap(([currentLanguage, currentLocale]) => {
                    return this.modalService.fromComponent(UiLanguageSwitcherDialogComponent, {
                        closable: true,
                        size: 'lg',
                        locals: {
                            availableLocales: this.availableLocales,
                            availableLanguages: this.availableLanguages,
                            currentLanguage: currentLanguage,
                            currentLocale: currentLocale,
                        },
                    });
                }),
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
