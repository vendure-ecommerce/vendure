import { Money } from "@/components/data-display/money.js";

export interface MoneyGrossNetProps {
    priceWithTax: number;
    price: number;
    currencyCode: string;
}

export function MoneyGrossNet({ priceWithTax, price, currencyCode }: MoneyGrossNetProps) {
    return   <div className="flex flex-col gap-1">
        <div>
            <Money value={priceWithTax} currencyCode={currencyCode} />
        </div>
        <div className="text-xs text-muted-foreground">
            <Money value={price} currencyCode={currencyCode} />
        </div>
    </div>;
}
