import { Money } from '@/vdb/components/data-display/money.js';
import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Check, PlayIcon } from 'lucide-react';

export interface ShippingMethodQuote {
    id: string;
    name: string;
    code: string;
    description: string;
    price: number;
    priceWithTax: number;
    metadata?: Record<string, any>;
}

interface ShippingEligibilityTestResultProps {
    testResult?: ShippingMethodQuote[];
    okToRun: boolean;
    testDataUpdated: boolean;
    hasTestedOnce: boolean;
    onRunTest: () => void;
    loading?: boolean;
}

export function TestShippingMethodsResult({
    testResult,
    okToRun,
    testDataUpdated,
    hasTestedOnce,
    onRunTest,
    loading = false,
}: ShippingEligibilityTestResultProps) {
    const { activeChannel } = useChannel();
    const currencyCode = activeChannel?.defaultCurrencyCode ?? 'USD';
    const hasResults = testResult && testResult.length > 0;
    const canRunTest = okToRun && testDataUpdated;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>
                        <Trans>Test Results</Trans>
                    </span>
                    {okToRun && (
                        <Button
                            onClick={onRunTest}
                            disabled={!canRunTest || loading}
                            size="sm"
                            className="ml-auto"
                        >
                            <PlayIcon className="mr-2 h-4 w-4" />
                            <Trans>Run Test</Trans>
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!okToRun && (
                    <Alert>
                        <AlertDescription>
                            <Trans>
                                Please add products and complete the shipping address to run the test.
                            </Trans>
                        </AlertDescription>
                    </Alert>
                )}

                {okToRun && testDataUpdated && hasTestedOnce && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            <Trans>
                                Test data has been updated. Click "Run Test" to see updated results.
                            </Trans>
                        </AlertDescription>
                    </Alert>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            <Trans>Testing shipping methods...</Trans>
                        </p>
                    </div>
                )}

                {hasResults && !loading && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium">
                                <Trans>
                                    Found {testResult.length} eligible shipping method
                                    {testResult.length !== 1 ? 's' : ''}
                                </Trans>
                            </span>
                        </div>

                        {testResult.map(method => (
                            <div
                                key={method.id}
                                className="flex items-center text-sm justify-between p-3 rounded-lg bg-muted/50"
                            >
                                <div className="flex-1">
                                    <div className="flex gap-1">
                                        <Check className="h-5 w-5 text-success" />
                                        <div className="">{method.name}</div>
                                    </div>
                                    <Badge variant="secondary">{method.code}</Badge>
                                    {method.description && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {method.description}
                                        </div>
                                    )}
                                    {method.metadata && Object.keys(method.metadata).length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {Object.entries(method.metadata).map(([key, value]) => (
                                                <Badge key={key} variant="outline" className="text-xs">
                                                    {key}: {String(value)}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <Money value={method.priceWithTax} currency={currencyCode} />
                                    <div className="text-xs text-muted-foreground">
                                        <Trans>ex. tax:</Trans>{' '}
                                        <Money value={method.price} currency={currencyCode} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {testResult && testResult.length === 0 && !loading && !testDataUpdated && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            <Trans>No eligible shipping methods found for this order.</Trans>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
