import { Money } from '@/vdb/components/data-display/money.js';
import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ResultOf } from 'gql.tada';
import { Check, PlayIcon } from 'lucide-react';
import { testShippingMethodDocument } from '../shipping-methods.graphql.js';

export type TestShippingMethodResult = ResultOf<typeof testShippingMethodDocument>['testShippingMethod'];

interface TestSingleMethodResultProps {
    testResult?: TestShippingMethodResult;
    okToRun: boolean;
    testDataUpdated: boolean;
    hasTestedOnce: boolean;
    onRunTest: () => void;
    loading?: boolean;
}

export function TestSingleMethodResult({
    testResult,
    okToRun,
    testDataUpdated,
    hasTestedOnce,
    onRunTest,
    loading = false,
}: TestSingleMethodResultProps) {
    const { activeChannel } = useChannel();
    const currencyCode = activeChannel?.defaultCurrencyCode ?? 'USD';
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
                            <Trans>Testing shipping method...</Trans>
                        </p>
                    </div>
                )}

                {testResult && !loading && (
                    <div className="space-y-4">
                        {testResult.eligible ? (
                            <div className="space-y-3">
                                {testResult.quote && (
                                    <div className="p-3 border rounded-lg bg-muted/50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-success" />
                                                <span className="text-sm">
                                                    <Trans>Shipping method is eligible for this order</Trans>
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <Money
                                                    value={testResult.quote.priceWithTax}
                                                    currency={currencyCode}
                                                />
                                                <div className="text-xs text-muted-foreground">
                                                    <Trans>ex. tax:</Trans>{' '}
                                                    <Money
                                                        value={testResult.quote.price}
                                                        currency={currencyCode}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {testResult.quote.metadata &&
                                                Object.keys(testResult.quote.metadata).length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {Object.entries(testResult.quote.metadata).map(
                                                            ([key, value]) => (
                                                                <Badge
                                                                    key={key}
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {key}: {String(value)}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-destructive">
                                    <Trans>Shipping method is not eligible for this order</Trans>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    <Trans>
                                        This shipping method's eligibility checker conditions are not met for
                                        the current order and shipping address.
                                    </Trans>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {testResult === undefined && hasTestedOnce && !testDataUpdated && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Trans>Click "Run Test" to test this shipping method.</Trans>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
