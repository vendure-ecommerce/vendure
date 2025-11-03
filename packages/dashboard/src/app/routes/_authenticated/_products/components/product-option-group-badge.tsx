import { Badge } from '@/vdb/components/ui/badge.js';
import { Link } from '@tanstack/react-router';
import { Edit2 } from 'lucide-react';

interface ProductOptionGroupBadgeProps {
    id: string;
    name: string;
}

export function ProductOptionGroupBadge({ id, name }: ProductOptionGroupBadgeProps) {
    return (
        <Badge variant="secondary" className="text-xs">
            <span>{name}</span>
            <Link to={`option-groups/${id}`} className="ml-1.5 inline-flex">
                <Edit2 className="h-3 w-3" />
            </Link>
        </Badge>
    );
}
