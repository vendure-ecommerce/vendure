import { useLocalFormat } from '@/hooks/use-local-format.js';

export function DateTime({ value }: { value: string | Date }) {
    const { formatDate } = useLocalFormat();
    let renderedDate: string;
    try {
        renderedDate = formatDate(value);
    } catch (e) {
        renderedDate = value.toString();
        console.error(e);
    }
    return renderedDate;
}
