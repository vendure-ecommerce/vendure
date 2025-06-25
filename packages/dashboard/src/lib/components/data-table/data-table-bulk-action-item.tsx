import { usePermissions } from '@/hooks/use-permissions.js';
import { Trans } from '@/lib/trans.js';
import { cn } from '@/lib/utils.js';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog.js';
import { DropdownMenuItem } from '../ui/dropdown-menu.js';

export interface DataTableBulkActionItemProps {
    label: React.ReactNode;
    icon?: LucideIcon;
    confirmationText?: React.ReactNode;
    onClick: () => void;
    className?: string;
    requiresPermission?: string[];
}

export function DataTableBulkActionItem({
    label,
    icon: Icon,
    confirmationText,
    className,
    onClick,
    requiresPermission,
}: DataTableBulkActionItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { hasPermissions } = usePermissions();
    const userHasPermission = hasPermissions(requiresPermission ?? []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userHasPermission) {
            return;
        }
        if (confirmationText) {
            setIsOpen(true);
        } else {
            onClick?.();
        }
    };

    const handleConfirm = () => {
        setIsOpen(false);
        onClick?.();
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    if (confirmationText) {
        return (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onClick={handleClick} disabled={!userHasPermission}>
                        {Icon && <Icon className={cn('mr-1 h-4 w-4', className)} />}
                        <span className={cn('text-sm', className)}>
                            <Trans>{label}</Trans>
                        </span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <Trans>Confirm Action</Trans>
                        </AlertDialogTitle>
                        <AlertDialogDescription>{confirmationText}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            <Trans>Cancel</Trans>
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            <Trans>Continue</Trans>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <DropdownMenuItem onClick={handleClick}>
            {Icon && <Icon className={cn('mr-1 h-4 w-4', className)} />}
            <span className={cn('text-sm', className)}>
                <Trans>{label}</Trans>
            </span>
        </DropdownMenuItem>
    );
}
