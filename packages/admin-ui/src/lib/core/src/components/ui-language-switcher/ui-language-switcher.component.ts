import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LanguageCode } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { I18nService } from '../../providers/i18n/i18n.service';

@Component({
    selector: 'vdr-ui-language-switcher',
    templateUrl: './ui-language-switcher.component.html',
    styleUrls: ['./ui-language-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageSwitcherComponent implements OnInit {
    uiLanguage$: Observable<LanguageCode>;

    constructor(private dataService: DataService, private i18nService: I18nService) {}

    ngOnInit() {
        this.uiLanguage$ = this.dataService.client.uiState().stream$.pipe(
            map(data => data.uiState.language),
            tap(languageCode => this.i18nService.setLanguage(languageCode)),
        );
    }

    setLanguage(languageCode: string) {
        this.dataService.client.setUiLanguage(languageCode as LanguageCode).subscribe();
    }
}
