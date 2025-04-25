import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button.js';

export function DetailPageButton({
    id,
    label,
    disabled,
}: {
    id: string;
    label: string | React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <Button asChild variant="ghost" disabled={disabled}>
            <Link to={`./${id}`}>
                {label}
                {!disabled && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </Link>
        </Button>
    );
}
