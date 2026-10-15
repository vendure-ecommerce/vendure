import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { EmptyState, LoadingState } from '@/vdb/components/ui/state-views.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { usePlatformCapabilities } from '@/vdb/hooks/use-platform-capabilities.js';
import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Check, ExternalLink, Lock } from 'lucide-react';

const CATALOG_URL = 'https://api.vendure.io/v1/catalog';
const CONSOLE_URL = 'https://console.vendure.io';

/**
 * The fields of the public Vendure Console catalog (`GET /v1/catalog`) that this page uses.
 * The offers come from the lowest to the highest tier, and each offer lists only the
 * capabilities that it adds to the offer below it.
 */
interface CatalogResponse {
    offers: Array<{
        displayName: string;
        headlineCapabilities: Array<{ key: string; name: string; description: string }>;
    }>;
}

async function fetchCatalog(): Promise<CatalogResponse> {
    // An anonymous request: the catalog is public, and a request without credentials
    // gets the shared answer that every origin can read.
    const response = await fetch(CATALOG_URL, { credentials: 'omit' });
    if (!response.ok) {
        throw new Error(`The catalog request failed with status ${response.status}`);
    }
    return response.json();
}

export function OpenConsoleButton() {
    const platform = usePlatformCapabilities();
    let href = `${CONSOLE_URL}/signup`;
    if (platform?.consoleProjectId) {
        href = `${CONSOLE_URL}/projects/${encodeURIComponent(platform.consoleProjectId)}/subscription`;
    } else if (platform) {
        href = CONSOLE_URL;
    }
    return (
        <Button render={<a href={href} target="_blank" rel="noopener noreferrer" />}>
            <Trans>Open Vendure Console</Trans>
            <ExternalLink />
        </Button>
    );
}

export function PlatformCapabilityList() {
    const platform = usePlatformCapabilities();
    const { data, isPending, isError } = useQuery({
        queryKey: ['vendurePlatformCatalog'],
        queryFn: fetchCatalog,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    if (isPending) {
        return <LoadingState />;
    }
    if (isError) {
        return (
            <EmptyState
                title={<Trans>The capability catalog is not available</Trans>}
                description={
                    <Trans>
                        The Dashboard cannot get the capability list from Vendure Console. Open Vendure
                        Console to see the Vendure Platform capabilities.
                    </Trans>
                }
            />
        );
    }

    const granted = new Set(platform?.grantedCapabilities ?? []);
    const rows = data.offers.flatMap(offer =>
        offer.headlineCapabilities.map(capability => ({ ...capability, tier: offer.displayName })),
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Trans>Capability</Trans>
                    </TableHead>
                    <TableHead>
                        <Trans>Tier</Trans>
                    </TableHead>
                    <TableHead>
                        <Trans>Status</Trans>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map(row => (
                    <TableRow key={row.key} data-capability={row.key}>
                        <TableCell className="whitespace-normal">
                            <div className="font-medium">{row.name}</div>
                            <div className="text-muted-foreground">{row.description}</div>
                        </TableCell>
                        <TableCell>{row.tier}</TableCell>
                        <TableCell>
                            {granted.has(row.key) ? (
                                <Badge variant="success">
                                    <Check />
                                    <Trans>Granted</Trans>
                                </Badge>
                            ) : (
                                <Badge variant="outline">
                                    <Lock />
                                    <Trans>Locked</Trans>
                                </Badge>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
