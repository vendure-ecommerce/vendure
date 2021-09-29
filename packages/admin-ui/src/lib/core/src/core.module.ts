import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MessageFormatConfig, MESSAGE_FORMAT_CONFIG } from 'ngx-translate-messageformat-compiler';

import { getAppConfig } from './app.config';
import { getDefaultUiLanguage } from './common/utilities/get-default-ui-language';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ChannelSwitcherComponent } from './components/channel-switcher/channel-switcher.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayHostComponent } from './components/overlay-host/overlay-host.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { UiLanguageSwitcherDialogComponent } from './components/ui-language-switcher-dialog/ui-language-switcher-dialog.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { DataModule } from './data/data.module';
import { CustomHttpTranslationLoader } from './providers/i18n/custom-http-loader';
import { InjectableTranslateMessageFormatCompiler } from './providers/i18n/custom-message-format-compiler';
import { I18nService } from './providers/i18n/i18n.service';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { registerDefaultFormInputs } from './shared/dynamic-form-inputs/register-dynamic-input-components';
import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        DataModule,
        SharedModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, PlatformLocation],
            },
            compiler: { provide: TranslateCompiler, useClass: InjectableTranslateMessageFormatCompiler },
        }),
    ],
    providers: [
        { provide: MESSAGE_FORMAT_CONFIG, useFactory: getLocales },
        registerDefaultFormInputs(),
        Title,
    ],
    exports: [SharedModule, OverlayHostComponent],
    declarations: [
        AppShellComponent,
        UserMenuComponent,
        MainNavComponent,
        BreadcrumbComponent,
        OverlayHostComponent,
        NotificationComponent,
        UiLanguageSwitcherDialogComponent,
        ChannelSwitcherComponent,
        ThemeSwitcherComponent,
    ],
})
export class CoreModule {
    constructor(
        private i18nService: I18nService,
        private localStorageService: LocalStorageService,
        private titleService: Title,
    ) {
        this.initUiLanguages();
        this.initUiTitle();
    }

    private initUiLanguages() {
        const defaultLanguage = getDefaultUiLanguage();
        const lastLanguage = this.localStorageService.get('uiLanguageCode');
        const availableLanguages = getAppConfig().availableLanguages;

        if (!availableLanguages.includes(defaultLanguage)) {
            throw new Error(
                `The defaultLanguage "${defaultLanguage}" must be one of the availableLanguages [${availableLanguages
                    .map(l => `"${l}"`)
                    .join(', ')}]`,
            );
        }
        const uiLanguage =
            lastLanguage && availableLanguages.includes(lastLanguage) ? lastLanguage : defaultLanguage;
        this.localStorageService.set('uiLanguageCode', uiLanguage);
        this.i18nService.setLanguage(uiLanguage);
        this.i18nService.setDefaultLanguage(defaultLanguage);
        this.i18nService.setAvailableLanguages(availableLanguages || [defaultLanguage]);
    }

    private initUiTitle() {
        const title = getAppConfig().brand || 'VendureAdmin';

        this.titleService.setTitle(title);
    }
}

export function HttpLoaderFactory(http: HttpClient, location: PlatformLocation) {
    // Dynamically get the baseHref, which is configured in the angular.json file
    const baseHref = location.getBaseHrefFromDOM();
    return new CustomHttpTranslationLoader(http, baseHref + 'i18n-messages/');
}

/**
 * Returns the locales defined in the vendure-ui-config.json, ensuring that the
 * default language is the first item in the array as per the messageformat
 * documentation:
 *
 * > The default locale will be the first entry of the array
 * https://messageformat.github.io/messageformat/MessageFormat
 */
export function getLocales(): MessageFormatConfig {
    const locales = getAppConfig().availableLanguages;
    const defaultLanguage = getDefaultUiLanguage();
    const localesWithoutDefault = locales.filter(l => l !== defaultLanguage);
    return {
        locales: [defaultLanguage, ...localesWithoutDefault],
    };
}
