import { useLocalFormat } from "@/hooks/use-local-format.js";

export function Money({ value, currency }: { value: number, currency: string }) {
    const { formatCurrency } = useLocalFormat();
    return formatCurrency(value, currency);
}
