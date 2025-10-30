import { CurrencyCode } from '@/vdb/constants.js';
import { useDisplayLocale } from '@/vdb/hooks/use-display-locale.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useUiLanguageLoader } from '@/vdb/hooks/use-ui-language-loader.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';
import { uiConfig } from 'virtual:vendure-ui-config';
import { Button } from '../ui/button.js';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.js';
import { Label } from '../ui/label.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';

export function LanguageDialog() {
    const { i18n } = uiConfig;
    const { loadAndActivateLocale } = useUiLanguageLoader();
    const { availableLocales, availableLanguages } = i18n;
    const { settings, setDisplayLanguage, setDisplayLocale } = useUserSettings();
    const { humanReadableLanguageAndLocale } = useDisplayLocale();
    const availableCurrencyCodes = Object.values(CurrencyCode);
    const { formatCurrency, formatLanguageName, formatRegionName, formatCurrencyName, formatDate } =
        useLocalFormat();
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

    const orderedAvailableLanguages = availableLanguages.slice().sort((a, b) => a.localeCompare(b));
    const orderedAvailableLocales = availableLocales.slice().sort((a, b) => a.localeCompare(b));
    const handleLanguageChange = async (value: string) => {
        setDisplayLanguage(value);
        void loadAndActivateLocale(value);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <Trans>Select display language</Trans>
                </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1 w-full">
                    <Label>
                        <Trans>Display language</Trans>
                    </Label>
                    <Select defaultValue={settings.displayLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {orderedAvailableLanguages.map(language => (
                                <SelectItem key={language} value={language} className="flex gap-1">
                                    <span className="uppercase text-muted-foreground">{language}</span>
                                    <span>{formatLanguageName(language)}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>
                        <Trans>Locale</Trans>
                    </Label>
                    <Select defaultValue={settings.displayLocale} onValueChange={setDisplayLocale}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a locale" />
                        </SelectTrigger>
                        <SelectContent>
                            {orderedAvailableLocales.map(locale => (
                                <SelectItem key={locale} value={locale} className="flex gap-1">
                                    <span className="uppercase text-muted-foreground">{locale}</span>
                                    <span>{formatRegionName(locale)}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="bg-sidebar border border-border rounded-md px-6 py-4 space-y-4">
                <span className="font-medium block text-accent-foreground">
                    <Trans>Sample Formatting</Trans>:{' '}
                    <span className="text-muted-foreground">{humanReadableLanguageAndLocale}</span>
                </span>
                <Select defaultValue={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCurrencyCodes.map(currency => (
                            <SelectItem key={currency} value={currency}>
                                {formatCurrencyName(currency)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm font-medium">
                        <Trans>Medium date</Trans>
                    </span>
                    <span>{formatDate(new Date('2025-03-14'), { dateStyle: 'medium' })}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm font-medium">
                        <Trans>Short date</Trans>
                    </span>
                    <span>{formatDate(new Date('2025-03-14'), { dateStyle: 'short' })}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm font-medium">
                        <Trans>Price</Trans>
                    </span>
                    <span>{formatCurrency(100.0, selectedCurrency)}</span>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button>Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
