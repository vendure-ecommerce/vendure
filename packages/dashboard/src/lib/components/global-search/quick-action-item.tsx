import { CommandItem, CommandShortcut } from '@/vdb/components/ui/command.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { QuickAction } from '@/vdb/providers/search-provider.js';
import * as Icons from 'lucide-react';

interface QuickActionItemProps {
    action: QuickAction;
    onSelect: (actionId: string) => void;
}

export function QuickActionItem({ action, onSelect }: QuickActionItemProps) {
    // Get the icon component dynamically
    const IconComponent = action.icon 
        ? (Icons as any)[action.icon] || (Icons as any)[toPascalCase(action.icon)] || Icons.Zap
        : Icons.Zap;

    return (
        <CommandItem 
            key={action.id}
            value={`${action.id}-${action.label}`}
            onSelect={() => onSelect(action.id)}
            className="flex items-center gap-3 p-3"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                <IconComponent className="h-4 w-4" />
            </div>
            
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{action.label}</span>
                    {action.isContextAware && (
                        <Badge variant="secondary" className="text-xs">
                            Context
                        </Badge>
                    )}
                </div>
                {action.description && (
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                )}
            </div>

            {action.shortcut && (
                <CommandShortcut>
                    {formatShortcut(action.shortcut)}
                </CommandShortcut>
            )}
        </CommandItem>
    );
}

function toPascalCase(str: string): string {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function formatShortcut(shortcut: string): string {
    return shortcut
        .replace('ctrl', '⌘')
        .replace('cmd', '⌘')
        .replace('shift', '⇧')
        .replace('alt', '⌥')
        .replace('+', ' + ')
        .toUpperCase();
}