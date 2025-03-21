import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button.js';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

export function DetailPageButton({ id, label }: { id: string; label: string }) {
    return (
        <Button asChild variant="ghost">
            <Link to={`./${id}`}>
                {label}
                <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />
            </Link>
        </Button>
    );
}
