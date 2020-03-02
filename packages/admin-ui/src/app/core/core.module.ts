import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { getDefaultLanguage } from '../common/utilities/get-default-language';
import { DataModule } from '../data/data.module';
import { DataService } from '../data/providers/data.service';
import { SharedModule } from '../shared/shared.module';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ChannelSwitcherComponent } from './components/channel-switcher/channel-switcher.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OverlayHostComponent } from './components/overlay-host/overlay-host.component';
import { UiLanguageSwitcherComponent } from './components/ui-language-switcher/ui-language-switcher.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { AuthService } from './providers/auth/auth.service';
import { CustomFieldComponentService } from './providers/custom-field-component/custom-field-component.service';
import { AuthGuard } from './providers/guard/auth.guard';
import { CustomHttpTranslationLoader } from './providers/i18n/custom-http-loader';
import { InjectableTranslateMessageFormatCompiler } from './providers/i18n/custom-message-format-compiler';
import { I18nService } from './providers/i18n/i18n.service';
import { JobQueueService } from './providers/job-queue/job-queue.service';
import { LocalStorageService } from './providers/local-storage/local-storage.service';
import { NavBuilderService } from './providers/nav-builder/nav-builder.service';
import { NotificationService } from './providers/notification/notification.service';
import { OverlayHostService } from './providers/overlay-host/overlay-host.service';

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
    exports: [SharedModule, OverlayHostComponent],
    providers: [
        LocalStorageService,
        AuthGuard,
        AuthService,
        I18nService,
        OverlayHostService,
        NotificationService,
        JobQueueService,
        NavBuilderService,
        CustomFieldComponentService,
    ],
    declarations: [
        AppShellComponent,
        UserMenuComponent,
        MainNavComponent,
        BreadcrumbComponent,
        OverlayHostComponent,
        NotificationComponent,
        UiLanguageSwitcherComponent,
        JobListComponent,
        ChannelSwitcherComponent,
    ],
})
export class CoreModule {
    constructor(private dataService: DataService, private i18nService: I18nService) {
        this.dataService.client.setUiLanguage(getDefaultLanguage());
        this.i18nService.setDefaultLanguage(getDefaultLanguage());
    }
}

export function HttpLoaderFactory(http: HttpClient, location: PlatformLocation) {
    // Dynamically get the baseHref, which is configured in the angular.json file
    const baseHref = location.getBaseHrefFromDOM();
    return new CustomHttpTranslationLoader(http, baseHref + 'i18n-messages/');
}
