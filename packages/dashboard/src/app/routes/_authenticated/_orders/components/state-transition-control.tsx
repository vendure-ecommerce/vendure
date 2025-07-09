import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { EllipsisVertical } from 'lucide-react';

type StateType = 'default' | 'destructive' | 'success';

type StateTransitionAction = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: StateType;
};

type StateTransitionControlProps = {
    currentState: string;
    actions: StateTransitionAction[];
    isLoading?: boolean;
};

function getCurrentStateType(currentState: string): StateType {
    const currentStateLower = currentState.toLowerCase();
    switch (currentStateLower) {
        case 'cancelled':
        case 'error':
            return 'destructive';
        case 'completed':
        case 'settled':
        case 'delivered':
            return 'success';
        default:
            return 'default';
    }
}

export function StateTransitionControl({
    currentState,
    actions,
    isLoading,
}: Readonly<StateTransitionControlProps>) {
    const currentStateType = getCurrentStateType(currentState);
    let stylesForType = '';
    if (currentStateType === 'destructive') {
        stylesForType = 'border-destructive bg-destructive/10 text-destructive';
    } else if (currentStateType === 'success') {
        stylesForType = 'border-success bg-success/10 text-success';
    }

    return (
        <div className="mt-3 pt-3 border-t">
            <div className="flex">
                <div
                    className={cn(
                        'inline-flex items-center justify-center gap-2 whitespace-nowrap h-8 rounded-md px-3 text-xs font-medium border border-input bg-background',
                        stylesForType,
                        actions.length > 0 && 'rounded-r-none',
                    )}
                >
                    <Trans>State: {currentState}</Trans>
                </div>
                {actions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isLoading}
                                className={cn(
                                    'rounded-l-none border-l-0 shadow-none',
                                    stylesForType,
                                    'bg-background',
                                )}
                            >
                                <EllipsisVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {actions.map((action, index) => (
                                <DropdownMenuItem
                                    key={action.label + index}
                                    onClick={action.onClick}
                                    disabled={action.disabled || isLoading}
                                >
                                    <Trans>{action.label}</Trans>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
