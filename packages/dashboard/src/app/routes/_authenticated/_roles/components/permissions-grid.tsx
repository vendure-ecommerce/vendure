import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/vdb/components/ui/accordion.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Switch } from '@/vdb/components/ui/switch.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/vdb/components/ui/tooltip.js';
import { useGroupedPermissions } from '@/vdb/hooks/use-grouped-permissions.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { ServerConfig } from '@/vdb/providers/server-config.js';
import { useState } from 'react';

interface PermissionsGridProps {
    value: string[];
    onChange: (permissions: string[]) => void;
    readonly?: boolean;
}

export function PermissionsGrid({ value, onChange, readonly = false }: Readonly<PermissionsGridProps>) {
    const { i18n } = useLingui();
    const groupedPermissions = useGroupedPermissions();

    const setPermission = (permission: string, checked: boolean) => {
        if (readonly) return;

        const newPermissions = checked ? [...value, permission] : value.filter(p => p !== permission);
        onChange(newPermissions);
    };

    const toggleAll = (defs: ServerConfig['permissions']) => {
        if (readonly) return;

        const shouldEnable = defs.some(d => !value.includes(d.name));
        const newPermissions = shouldEnable
            ? [...new Set([...value, ...defs.map(d => d.name)])]
            : value.filter(p => !defs.some(d => d.name === p));
        onChange(newPermissions);
    };

    // Get default expanded sections based on which ones have active permissions
    const defaultExpandedSections = groupedPermissions
        .map(section => ({
            section,
            hasActivePermissions: section.permissions.some(permission => value.includes(permission.name)),
        }))
        .filter(({ hasActivePermissions }) => hasActivePermissions)
        .map(({ section }) => section.id);

    const [accordionValue, setAccordionValue] = useState<string[]>(defaultExpandedSections);

    return (
        <div className="w-full">
            <Accordion
                type="multiple"
                value={accordionValue.length ? accordionValue : defaultExpandedSections}
                onValueChange={setAccordionValue}
                className="space-y-4"
            >
                {groupedPermissions.map((section, index) => (
                    <AccordionItem key={index} value={section.id} className="border rounded-lg px-6">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col items-start gap-1 text-sm py-2">
                                <div>{i18n.t(section.label)}</div>
                                <div className="text-muted-foreground text-sm font-normal">
                                    {i18n.t(section.description)}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="pb-4 space-y-4">
                                {section.permissions.length > 1 && !readonly && (
                                    <Button
                                        variant="outline"
                                        type="button"
                                        size="sm"
                                        onClick={() => toggleAll(section.permissions)}
                                        className="w-fit"
                                    >
                                        <Trans>Toggle all</Trans>
                                    </Button>
                                )}
                                <div className="md:grid md:grid-cols-4 md:gap-2 space-y-2">
                                    {section.permissions.map(permission => (
                                        <div key={permission.name} className="flex items-center space-x-2">
                                            <Switch
                                                id={permission.name}
                                                checked={value.includes(permission.name)}
                                                onCheckedChange={checked =>
                                                    setPermission(permission.name, checked)
                                                }
                                                disabled={readonly}
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <label
                                                            htmlFor={permission.name}
                                                            className="text-sm whitespace-nowrap"
                                                        >
                                                            {i18n.t(permission.name)}
                                                        </label>
                                                    </TooltipTrigger>
                                                    <TooltipContent align="end">
                                                        <p>{i18n.t(permission.description)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
