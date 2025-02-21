import { useLingui } from '@lingui/react/macro';

export function DateTime({ value }: { value: string | Date }) {
    const { i18n } = useLingui();
    return <div>{i18n.date(value)}</div>;
}
