import React from 'react';
// import { i18n } from '@lingui/core';
// import { I18nProvider as LinguiI18nProvider } from '@lingui/react';

export const locales = {
    en: 'English',
    de: 'Deutsch',
};
export const defaultLocale = 'en';

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string, onActivate?: () => void) {
    // Temporarily disabled because Lingui macros do not work when the dashboard is packaged in an npm module.
    // Related issue: https://github.com/kentcdodds/babel-plugin-macros/issues/87

    // const { messages } = await import(`../../i18n/locales/${locale}.po`);
    // i18n.load(locale, messages);
    // i18n.activate(locale);
    onActivate?.();
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    // return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
    return <>{children}</>;
}
