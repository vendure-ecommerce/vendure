import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@lingui/react/macro';
import { SquareDashedMousePointer, XIcon } from 'lucide-react';

export function DevModeIndicator() {
    const { setDevMode } = useUserSettings();
    return (
        <Badge className="bg-dev-mode text-background">
            <div>
                <SquareDashedMousePointer className="w-4 h-4" />
            </div>
            <div>
                <Trans>Dev Mode</Trans>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={() => setDevMode(false)}>
                <XIcon className="w-4 h-4" />
            </Button>
        </Badge>
    );
}
