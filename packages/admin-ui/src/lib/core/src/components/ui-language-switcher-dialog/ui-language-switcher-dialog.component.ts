import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, finalize, take, takeUntil } from 'rxjs';
import { CurrencyCode, LanguageCode } from '../../common/generated-types';
import { Dialog } from '../../providers/modal/modal.types';
import { DataService } from '../../data/providers/data.service';

@Component({
    selector: 'vdr-ui-language-switcher',
    templateUrl: './ui-language-switcher-dialog.component.html',
    styleUrls: ['./ui-language-switcher-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLanguageSwitcherDialogComponent
    implements Dialog<[LanguageCode, string | undefined]>, OnInit, OnDestroy
{
    isLoading = true;
    private destroy$ = new Subject<void>();
    resolveWith: (result?: [LanguageCode, string | undefined]) => void;
    currentLanguage: LanguageCode;
    availableLanguages: LanguageCode[] = [];
    currentLocale: string | undefined;
    availableLocales: string[] = [
        'AF',
        'AL',
        'DZ',
        'AS',
        'AD',
        'AO',
        'AI',
        'AQ',
        'AG',
        'AR',
        'AM',
        'AW',
        'AU',
        'AT',
        'AZ',
        'BS',
        'BH',
        'BD',
        'BB',
        'BY',
        'BE',
        'BZ',
        'BJ',
        'BM',
        'BT',
        'BO',
        'BQ',
        'BA',
        'BW',
        'BV',
        'BR',
        'IO',
        'BN',
        'BG',
        'BF',
        'BI',
        'CV',
        'KH',
        'CM',
        'CA',
        'KY',
        'CF',
        'TD',
        'CL',
        'CN',
        'CX',
        'CC',
        'CO',
        'KM',
        'CD',
        'CG',
        'CK',
        'CR',
        'HR',
        'CU',
        'CW',
        'CY',
        'CZ',
        'CI',
        'DK',
        'DJ',
        'DM',
        'DO',
        'EC',
        'EG',
        'SV',
        'GQ',
        'ER',
        'EE',
        'SZ',
        'ET',
        'FK',
        'FO',
        'FJ',
        'FI',
        'FR',
        'GF',
        'PF',
        'TF',
        'GA',
        'GM',
        'GE',
        'DE',
        'GH',
        'GI',
        'GR',
        'GL',
        'GD',
        'GP',
        'GU',
        'GT',
        'GG',
        'GN',
        'GW',
        'GY',
        'HT',
        'HM',
        'VA',
        'HN',
        'HK',
        'HU',
        'IS',
        'IN',
        'ID',
        'IR',
        'IQ',
        'IE',
        'IM',
        'IL',
        'IT',
        'JM',
        'JP',
        'JE',
        'JO',
        'KZ',
        'KE',
        'KI',
        'KP',
        'KR',
        'KW',
        'KG',
        'LA',
        'LV',
        'LB',
        'LS',
        'LR',
        'LY',
        'LI',
        'LT',
        'LU',
        'MO',
        'MG',
        'MW',
        'MY',
        'MV',
        'ML',
        'MT',
        'MH',
        'MQ',
        'MR',
        'MU',
        'YT',
        'MX',
        'FM',
        'MD',
        'MC',
        'MN',
        'ME',
        'MS',
        'MA',
        'MZ',
        'MM',
        'NA',
        'NR',
        'NP',
        'NL',
        'NC',
        'NZ',
        'NI',
        'NE',
        'NG',
        'NU',
        'NF',
        'MK',
        'MP',
        'NO',
        'OM',
        'PK',
        'PW',
        'PS',
        'PA',
        'PG',
        'PY',
        'PE',
        'PH',
        'PN',
        'PL',
        'PT',
        'PR',
        'QA',
        'RO',
        'RU',
        'RW',
        'RE',
        'BL',
        'SH',
        'KN',
        'LC',
        'MF',
        'PM',
        'VC',
        'WS',
        'SM',
        'ST',
        'SA',
        'SN',
        'RS',
        'SC',
        'SL',
        'SG',
        'SX',
        'SK',
        'SI',
        'SB',
        'SO',
        'ZA',
        'GS',
        'SS',
        'ES',
        'LK',
        'SD',
        'SR',
        'SJ',
        'SE',
        'CH',
        'SY',
        'TW',
        'TJ',
        'TZ',
        'TH',
        'TL',
        'TG',
        'TK',
        'TO',
        'TT',
        'TN',
        'TR',
        'TM',
        'TC',
        'TV',
        'UG',
        'UA',
        'AE',
        'GB',
        'UM',
        'US',
        'UY',
        'UZ',
        'VU',
        'VE',
        'VN',
        'VG',
        'VI',
        'WF',
        'EH',
        'YE',
        'ZM',
        'ZW',
        'AX',
    ];
    availableCurrencyCodes = Object.values(CurrencyCode);
    selectedCurrencyCode;
    previewLocale: string;
    readonly browserDefaultLocale: string | undefined;
    readonly now = new Date().toISOString();

    constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) {
        const browserLanguage = navigator.language.split('-');
        this.browserDefaultLocale = browserLanguage.length === 1 ? undefined : browserLanguage[1];
    }

    ngOnInit() {
        this.updatePreviewLocale();

        this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel.defaultCurrencyCode)
            .pipe(
                take(1),
                takeUntil(this.destroy$),
                finalize(() => {
                    this.isLoading = false;
                    this.changeDetector.markForCheck();
                }),
            )
            .subscribe(x => {
                this.selectedCurrencyCode = x;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updatePreviewLocale() {
        if (!this.currentLocale || this.currentLocale.length === 0 || this.currentLocale.length === 2) {
            this.previewLocale = this.createLocaleString(this.currentLanguage, this.currentLocale);
        }
    }

    setLanguage() {
        this.resolveWith([this.currentLanguage, this.currentLocale?.toUpperCase()]);
    }

    cancel() {
        this.resolveWith();
    }

    private createLocaleString(languageCode: LanguageCode, region?: string | null): string {
        if (!region) {
            return languageCode;
        }
        return [languageCode, region.toUpperCase()].join('-');
    }
}
