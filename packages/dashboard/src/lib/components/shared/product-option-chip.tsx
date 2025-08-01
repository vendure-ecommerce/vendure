import { Badge } from '@/vdb/components/ui/badge.js';
import { X } from 'lucide-react';

// Interface for facet value type
interface ProductOption {
    id: string;
    name: string;
    code: string;
    group: {
        id: string;
        name: string;
        code: string;
    };
}

interface ProductOptionChipProps {
    productOption: ProductOption;
    removable?: boolean;
    displayGroupName?: boolean;
    onRemove?: (id: string) => void;
}

export function ProductOptionChip({
    productOption,
    removable = true,
    onRemove,
    displayGroupName = true,
}: ProductOptionChipProps) {
    return (
        <Badge
            variant="secondary"
            className="flex items-center gap-2 py-0.5 pl-2 pr-1 h-6 hover:bg-secondary/80"
        >
            <div className="flex items-center gap-1.5">
                <span className="font-medium">{productOption.name}</span>
                {displayGroupName && (
                    <span className="text-muted-foreground text-xs">in {productOption.group.name}</span>
                )}
            </div>
            {removable && (
                <button
                    type="button"
                    className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/30"
                    onClick={() => onRemove?.(productOption.id)}
                    aria-label={`Remove ${productOption.name} from ${productOption.group.name}`}
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </Badge>
    );
}
