import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { getDefaultLanguage } from './common/utilities/get-default-language';
import { CoreModule } from './core/core.module';
import { CustomHttpTranslationLoader } from './core/providers/i18n/custom-http-loader';
import { DataService } from './data/providers/data.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new CustomHttpTranslationLoader(http, '/i18n-messages/');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: false }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            compiler: { provide: TranslateCompiler, useClass: TranslateMessageFormatCompiler },
        }),
        CoreModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(private dataService: DataService) {
        this.dataService.client.setUiLanguage(getDefaultLanguage());
    }
}
