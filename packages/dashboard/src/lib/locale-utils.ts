export function getLocalizedLanguageName(value: string, locale: string): string {
    try {
        return (
            new Intl.DisplayNames([locale.replace('_', '-')], { type: 'language' }).of(
                value.replace('_', '-'),
            ) ?? value
        );
    } catch (e: any) {
        return value;
    }
}
