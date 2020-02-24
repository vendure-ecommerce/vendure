import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { getDefaultLanguage } from './common/utilities/get-default-language';
import { CoreModule } from './core/core.module';
import { CustomHttpTranslationLoader } from './core/providers/i18n/custom-http-loader';
import { InjectableTranslateMessageFormatCompiler } from './core/providers/i18n/custom-message-format-compiler';
import { I18nService } from './core/providers/i18n/i18n.service';
import { DataService } from './data/providers/data.service';
import { SharedExtensionsModule } from './extensions/shared-extensions.module';

@Injectable()
export class BaseHrefHolder {
    constructor(@Inject(APP_BASE_HREF) public addBaseHref: string) {}
}

export function HttpLoaderFactory(http: HttpClient, location: PlatformLocation) {
    // Dynamically get the baseHref, which is configured in the angular.json file
    const baseHref = location.getBaseHrefFromDOM();
    return new CustomHttpTranslationLoader(http, baseHref + 'i18n-messages/');
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: false }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, PlatformLocation],
            },
            compiler: { provide: TranslateCompiler, useClass: InjectableTranslateMessageFormatCompiler },
        }),
        CoreModule,
        SharedExtensionsModule,
    ],
    providers: [BaseHrefHolder],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private dataService: DataService, private i18nService: I18nService) {
        this.dataService.client.setUiLanguage(getDefaultLanguage());
        this.i18nService.setDefaultLanguage(getDefaultLanguage());
    }
}
