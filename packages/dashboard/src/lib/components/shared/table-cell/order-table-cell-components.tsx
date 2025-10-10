import { Money } from '@/vdb/components/data-display/money.js';
import { DataTableCellComponent } from '@/vdb/components/data-table/types.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useDynamicTranslations } from '@/vdb/hooks/use-dynamic-translations.js';
import { Link } from '@tanstack/react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';

type CustomerCellData = {
    customer: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
};

export const CustomerCell: DataTableCellComponent<CustomerCellData> = ({ row }) => {
    const value = row.original.customer;
    if (!value) {
        return null;
    }
    return (
        <Button asChild variant="ghost">
            <Link to={`/customers/${value.id}`}>
                {value.firstName} {value.lastName}
            </Link>
        </Button>
    );
};

export const OrderStateCell: DataTableCellComponent<{ state: string }> = ({ row }) => {
    const { getTranslatedOrderState } = useDynamicTranslations();
    const value = row.original.state;
    return <Badge variant="outline">{getTranslatedOrderState(value)}</Badge>;
};

export const OrderMoneyCell: DataTableCellComponent<{ currencyCode: string }> = ({ cell, row }) => {
    const value = cell.getValue();
    const currencyCode = row.original.currencyCode;
    return <Money value={value} currency={currencyCode} />;
};

export const RichTextDescriptionCell: DataTableCellComponent<{ description: string }> = ({ cell }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const value = cell.getValue();

    // Strip HTML tags and decode HTML entities
    const textContent = useMemo(() => {
        const stripped = value?.replace(/<[^>]*>/g, '') || '';
        const textArea = document.createElement('textarea');
        textArea.innerHTML = stripped;
        return textArea.value;
    }, [value]);

    const shortLength = 100;
    const maxLength = 500;
    const isTooLong = textContent.length > shortLength;

    const displayText = isExpanded ? textContent.slice(0, maxLength) : textContent.slice(0, shortLength);

    return (
        <div>
            <div>
                {displayText}
                {!isExpanded && isTooLong && '...'}
            </div>
            {!isExpanded && isTooLong && (
                <Button onClick={() => setIsExpanded(true)} variant="ghost" size="xs">
                    <ChevronDown />
                </Button>
            )}
            {isExpanded && (
                <Button onClick={() => setIsExpanded(false)} variant="ghost" size="xs">
                    <ChevronUp />
                </Button>
            )}
        </div>
    );
};
