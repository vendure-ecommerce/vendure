import { CopyableText } from '@/vdb/components/shared/copyable-text.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { CodeXmlIcon, InfoIcon } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

const LocationWrapperContext = createContext<{
    parentId: string | null;
    hoveredId: string | null;
    setHoveredId: ((id: string | null) => void) | null;
}>({
    parentId: null,
    hoveredId: null,
    setHoveredId: null,
});

export function LocationWrapper({ children, blockId }: { children: React.ReactNode; blockId?: string }) {
    const page = usePage();
    const { settings } = useUserSettings();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const isPageWrapper = !blockId;

    const [hoveredIdTopLevel, setHoveredIdTopLevel] = useState<string | null>(null);
    const { hoveredId, setHoveredId, parentId } = useContext(LocationWrapperContext);
    const id = `${page.pageId}-${blockId ?? 'page'}`;
    const isHovered = hoveredId === id || hoveredIdTopLevel === id;

    const setHoverId = (id: string | null) => {
        if (setHoveredId) {
            setHoveredId(id);
        } else {
            setHoveredIdTopLevel(id);
        }
    };

    if (settings.devMode) {
        const pageId = page.pageId;
        return (
            <LocationWrapperContext.Provider
                value={{ hoveredId: hoveredIdTopLevel, setHoveredId: setHoveredIdTopLevel, parentId: id }}
            >
                <div
                    className={cn(
                        `ring-2 rounded-xl transition-all delay-50 relative`,
                        isHovered || isPopoverOpen ? 'ring-dev-mode' : 'ring-transparent',
                        isPageWrapper ? 'ring-inset' : '',
                    )}
                    onMouseEnter={() => setHoverId(id)}
                    onMouseLeave={() => setHoverId(parentId)}
                >
                    <div
                        className={`absolute top-0.5 right-0.5 transition-all delay-50 z-10 ${isHovered || isPopoverOpen ? 'visible' : 'invisible'}`}
                    >
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-lg">
                                    <CodeXmlIcon className="text-dev-mode w-5 h-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <InfoIcon className="h-4 w-4 text-dev-mode" />
                                        <span className="font-medium">
                                            <Trans>Location Details</Trans>
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {pageId && (
                                            <div>
                                                <div className="text-xs text-muted-foreground">pageId</div>
                                                <CopyableText text={pageId} />
                                            </div>
                                        )}
                                        {blockId && (
                                            <div>
                                                <div className="text-xs text-muted-foreground">blockId</div>
                                                <CopyableText text={blockId} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {children}
                </div>
            </LocationWrapperContext.Provider>
        );
    }
    return children;
}
