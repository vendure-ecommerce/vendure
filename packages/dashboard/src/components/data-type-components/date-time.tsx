import { useLingui } from '@lingui/react/macro';

export function DateTime({ value }: { value: string | Date }) {
    const { i18n } = useLingui();
    let renderedDate: string;
    try {
        renderedDate = i18n.date(value);
    } catch (e) {
        renderedDate = value.toString();
        console.error(e);
    }
    return <div>{renderedDate}</div>;
}
