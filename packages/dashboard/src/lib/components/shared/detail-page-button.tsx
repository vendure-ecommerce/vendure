import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button.js';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

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
                {!disabled && <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />}
            </Link>
        </Button>
    );
}
