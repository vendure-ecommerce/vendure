import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LanguageCode } from '../../common/generated-types';
import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-ui-language-switcher',
    templateUrl: './ui-language-switcher-dialog.component.html',
    styleUrls: ['./ui-language-switcher-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageSwitcherDialogComponent implements Dialog<LanguageCode> {
    resolveWith: (result?: LanguageCode) => void;
    currentLanguage: LanguageCode;
    availableLanguages: LanguageCode[] = [];

    setLanguage(languageCode: LanguageCode) {
        this.resolveWith(languageCode);
    }
}
