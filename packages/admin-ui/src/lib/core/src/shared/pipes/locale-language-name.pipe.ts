import { ChangeDetectorRef, Optional, Pipe, PipeTransform } from '@angular/core';

import { DataService } from '../../data/providers/data.service';

import { LocaleBasePipe } from './locale-base.pipe';

/**
 * Displays a human-readable name for a given ISO 4217 currency code.
 */
@Pipe({
    name: 'localeLanguageName',
    pure: false,
})
export class LocaleLanguageNamePipe extends LocaleBasePipe implements PipeTransform {
    constructor(@Optional() dataService?: DataService, @Optional() changeDetectorRef?: ChangeDetectorRef) {
        super(dataService, changeDetectorRef);
    }
    transform(value: any, locale?: unknown): string {
        if (value == null || value === '') {
            return '';
        }
        if (typeof value !== 'string') {
            return `Invalid language code "${value as any}"`;
        }
        const activeLocale = typeof locale === 'string' ? locale : this.locale ?? 'en';

        // Awaiting TS types for this API: https://github.com/microsoft/TypeScript/pull/44022/files
        const DisplayNames = (Intl as any).DisplayNames;

        try {
            return new DisplayNames([activeLocale.replace('_', '-')], { type: 'language' }).of(
                value.replace('_', '-'),
            );
        } catch (e) {
            return value;
        }
    }
}
