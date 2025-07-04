/**
 * This is a temporary work-around because the Lingui macros do not
 * currently work when the dashboard is packaged in an npm
 * module. Related issue: https://github.com/kentcdodds/babel-plugin-macros/issues/87
 */
export function Trans({ children }: Readonly<{ children: React.ReactNode; context?: string }>) {
    return <>{children}</>;
}

export function useLingui() {
    return {
        i18n: {
            t: (key: string) => key,
        },
    };
}
