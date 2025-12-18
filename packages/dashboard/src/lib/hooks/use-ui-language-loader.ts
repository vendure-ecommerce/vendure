import { loadI18nMessages } from '@/vdb/lib/load-i18n-messages.js';
import { useLingui } from '@lingui/react/macro';

let currentlyLoading: string | null = null;

/**
 * @description
 * Loads the UI translations for the given locale and activates it
 * with the Lingui I18nProvider. Generally this is used internally
 * when the display language is set via the user > language dialog.
 *
 * @docsCategory hooks
 * @docsPage useUiLanguageLoader
 */
export function useUiLanguageLoader() {
    const { i18n } = useLingui();

    async function loadAndActivateLocale(locale: string) {
        if (currentlyLoading === locale) {
            return;
        }
        currentlyLoading = locale;
        const messages = await loadI18nMessages(locale);
        i18n.load(locale, messages);
        i18n.activate(locale);
        currentlyLoading = null;
    }

    return { loadAndActivateLocale };
}
