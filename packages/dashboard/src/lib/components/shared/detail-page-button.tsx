import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button.js';

export function DetailPageButton({
    id,
    href,
    label,
    disabled,
    search,
}: {
    label: string | React.ReactNode;
    id?: string;
    href?: string;
    disabled?: boolean;
    search?: Record<string, string>;
}) {
    if (!id && !href) {
        return <span>{label}</span>;
    }
    return (
        <Button asChild variant="ghost" disabled={disabled}>
            <Link to={href ?? `./${id}`} search={search ?? {}}>
                {label}
                {!disabled && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </Link>
        </Button>
    );
}
