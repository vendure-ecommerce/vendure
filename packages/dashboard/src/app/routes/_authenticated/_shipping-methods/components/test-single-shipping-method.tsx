import { Accordion } from '@/vdb/components/ui/accordion.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { VariablesOf } from 'gql.tada';
import { useCallback, useState } from 'react';
import { testShippingMethodDocument } from '../shipping-methods.graphql.js';
import { TestAddress, TestAddressForm } from './test-address-form.js';
import { TestOrderBuilder, TestOrderLine } from './test-order-builder.js';
import { TestSingleMethodResult } from './test-single-method-result.js';

interface TestSingleShippingMethodProps {
    checker: VariablesOf<typeof testShippingMethodDocument>['input']['checker'];
    calculator: VariablesOf<typeof testShippingMethodDocument>['input']['calculator'];
}

export function TestSingleShippingMethod({ checker, calculator }: Readonly<TestSingleShippingMethodProps>) {
    const [testAddress, setTestAddress] = useState<TestAddress | null>(null);
    const [testOrderLines, setTestOrderLines] = useState<TestOrderLine[]>([]);
    const [testDataUpdated, setTestDataUpdated] = useState(true);
    const [hasTestedOnce, setHasTestedOnce] = useState(false);
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>([
        'test-order',
        'shipping-address',
    ]);
    const [lastTestedAddress, setLastTestedAddress] = useState<TestAddress | null>(null);
    const [lastTestedOrderLines, setLastTestedOrderLines] = useState<TestOrderLine[]>([]);

    const allTestDataPresent = !!(testAddress && testOrderLines && testOrderLines.length > 0);
    console.log({ testAddress, testOrderLines });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['testShippingMethod', testAddress, testOrderLines, checker, calculator],
        queryFn: async () => {
            if (!testAddress || !testOrderLines.length) {
                return { testShippingMethod: null };
            }

            return api.query(testShippingMethodDocument, {
                input: {
                    shippingAddress: {
                        fullName: testAddress.fullName,
                        company: testAddress.company,
                        streetLine1: testAddress.streetLine1,
                        streetLine2: testAddress.streetLine2,
                        city: testAddress.city,
                        province: testAddress.province,
                        postalCode: testAddress.postalCode,
                        countryCode: testAddress.countryCode,
                        phoneNumber: testAddress.phoneNumber,
                    },
                    lines: testOrderLines.map(l => ({
                        productVariantId: l.id,
                        quantity: l.quantity,
                    })),
                    checker,
                    calculator,
                },
            });
        },
        enabled: false, // Only fetch when explicitly triggered via refetch()
    });

    const testResult = data?.testShippingMethod || undefined;

    const handleAddressChange = useCallback(
        (address: TestAddress) => {
            setTestAddress(address);
            if (hasTestedOnce && JSON.stringify(address) !== JSON.stringify(lastTestedAddress)) {
                setTestDataUpdated(true);
            }
        },
        [hasTestedOnce, lastTestedAddress],
    );

    const handleOrderLinesChange = useCallback(
        (lines: TestOrderLine[]) => {
            setTestOrderLines(lines);
            if (hasTestedOnce && JSON.stringify(lines) !== JSON.stringify(lastTestedOrderLines)) {
                setTestDataUpdated(true);
            }
        },
        [hasTestedOnce, lastTestedOrderLines],
    );

    const runTest = () => {
        if (allTestDataPresent) {
            setTestDataUpdated(false);
            setHasTestedOnce(true);
            setLastTestedAddress(testAddress);
            setLastTestedOrderLines(testOrderLines);
            setExpandedAccordions([]); // Collapse all accordions
            refetch();
        }
    };

    return (
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] px-4">
            <Accordion
                type="multiple"
                value={expandedAccordions}
                onValueChange={setExpandedAccordions}
                className="w-full"
            >
                <TestOrderBuilder onOrderLinesChange={handleOrderLinesChange} />
                <TestAddressForm onAddressChange={handleAddressChange} />
            </Accordion>

            <TestSingleMethodResult
                testResult={testResult}
                okToRun={allTestDataPresent}
                testDataUpdated={testDataUpdated}
                hasTestedOnce={hasTestedOnce}
                onRunTest={runTest}
                loading={isLoading}
            />
        </div>
    );
}
