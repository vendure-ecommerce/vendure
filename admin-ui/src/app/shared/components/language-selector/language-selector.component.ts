import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LanguageCode } from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
    @Input() currentLanguageCode: LanguageCode;
    @Input() availableLanguageCodes: LanguageCode[];
    @Output() languageCodeChange = new EventEmitter<LanguageCode>();
}
