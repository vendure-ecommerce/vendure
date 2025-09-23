import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@/vdb/lib/trans.js';
import { PlayIcon } from 'lucide-react';

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
    currencyCode: string;
    onRunTest: () => void;
    loading?: boolean;
}

export function ShippingEligibilityTestResult({
    testResult,
    okToRun,
    testDataUpdated,
    hasTestedOnce,
    currencyCode,
    onRunTest,
    loading = false,
}: ShippingEligibilityTestResultProps) {
    const { formatCurrency } = useLocalFormat();
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
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{method.name}</div>
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
                                    <div className="font-medium">
                                        {formatCurrency(method.priceWithTax, currencyCode)}
                                    </div>
                                    {method.price !== method.priceWithTax && (
                                        <div className="text-sm text-muted-foreground">
                                            <Trans>excl. tax:</Trans>{' '}
                                            {formatCurrency(method.price, currencyCode)}
                                        </div>
                                    )}
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
