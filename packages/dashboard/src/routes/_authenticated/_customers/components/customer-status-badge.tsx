import { Badge } from '@/components/ui/badge.js';
import { BadgeX, BadgeCheck } from 'lucide-react';
import { Trans } from '@lingui/react/macro';

export function CustomerStatusBadge({ status }: { status: 'guest' | 'registered' | 'verified' }) {
    return (
        <Badge variant="outline">
            {status === 'verified' ? (
                <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-success" />
                    <Trans>Verified</Trans>
                </div>
            ) : status === 'registered' ? (
                <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    <Trans>Registered</Trans>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <BadgeX className="w-4 h-4" />
                    <Trans>Unverified</Trans>
                </div>
            )}
        </Badge>
    );
}
