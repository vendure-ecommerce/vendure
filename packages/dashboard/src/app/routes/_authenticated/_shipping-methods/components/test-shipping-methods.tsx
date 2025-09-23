import { Accordion } from '@/vdb/components/ui/accordion.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { ShippingEligibilityTestResult } from './shipping-eligibility-test-result.js';
import { TestAddress, TestAddressForm } from './test-address-form.js';
import { TestOrderBuilder, TestOrderLine } from './test-order-builder.js';
import { testEligibleShippingMethodsDocument } from './test-shipping-methods.graphql.js';

interface TestEligibleShippingMethodsInput {
    shippingAddress: TestAddress;
    lines: Array<{ productVariantId: string; quantity: number }>;
}

export function TestShippingMethods() {
    const [testAddress, setTestAddress] = useState<TestAddress | null>(null);
    const [testOrderLines, setTestOrderLines] = useState<TestOrderLine[]>([]);
    const [testDataUpdated, setTestDataUpdated] = useState(true); // Start with true for initial test
    const [hasTestedOnce, setHasTestedOnce] = useState(false);
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>([
        'test-order',
        'shipping-address',
    ]);
    const [lastTestedAddress, setLastTestedAddress] = useState<TestAddress | null>(null);
    const [lastTestedOrderLines, setLastTestedOrderLines] = useState<TestOrderLine[]>([]);

    const allTestDataPresent = !!(
        testAddress &&
        testOrderLines &&
        testOrderLines.length > 0 &&
        testAddress.fullName &&
        testAddress.streetLine1 &&
        testAddress.city &&
        testAddress.province &&
        testAddress.postalCode &&
        testAddress.countryCode
    );

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['testEligibleShippingMethods', testAddress, testOrderLines],
        networkMode: 'always',
        queryFn: async () => {
            if (!testAddress || !testOrderLines.length) {
                return { testEligibleShippingMethods: [] };
            }

            return api.query(testEligibleShippingMethodsDocument, {
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
                },
            });
        },
        enabled: false, // Only fetch when explicitly triggered via refetch()
    });

    const testResult = data?.testEligibleShippingMethods || [];

    const handleAddressChange = useCallback(
        (address: TestAddress) => {
            setTestAddress(address);
            // Only mark as updated if the data actually changed from what was last tested
            if (hasTestedOnce && JSON.stringify(address) !== JSON.stringify(lastTestedAddress)) {
                setTestDataUpdated(true);
            }
        },
        [hasTestedOnce, lastTestedAddress],
    );

    const handleOrderLinesChange = useCallback(
        (lines: TestOrderLine[]) => {
            setTestOrderLines(lines);
            // Only mark as updated if the data actually changed from what was last tested
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
                <TestOrderBuilder
                    currencyCode="USD" // This should come from active channel
                    onOrderLinesChange={handleOrderLinesChange}
                />
                <TestAddressForm onAddressChange={handleAddressChange} />
            </Accordion>

            <ShippingEligibilityTestResult
                testResult={testResult}
                okToRun={allTestDataPresent}
                testDataUpdated={testDataUpdated}
                hasTestedOnce={hasTestedOnce}
                currencyCode="USD" // This should come from active channel
                onRunTest={runTest}
                loading={isLoading}
            />
        </div>
    );
}
