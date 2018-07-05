import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatDebugCompiler } from 'ngx-translate-messageformat-compiler';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { CustomLoader } from './core/providers/i18n/custom-loader';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: false }),
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: CustomLoader },
            compiler: { provide: TranslateCompiler, useClass: TranslateMessageFormatDebugCompiler },
        }),
        CoreModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
