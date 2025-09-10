import { Money } from '@/vdb/components/data-display/money.js';
import { DataTableCellComponent } from '@/vdb/components/data-table/types.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Link } from '@tanstack/react-router';

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
    const value = row.original.state;
    return <Badge variant="outline">{value}</Badge>;
};

export const OrderMoneyCell: DataTableCellComponent<{ currencyCode: string }> = ({ cell, row }) => {
    const value = cell.getValue();
    const currencyCode = row.original.currencyCode;
    return <Money value={value} currency={currencyCode} />;
};
