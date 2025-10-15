import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MoneyInput } from './money-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/MoneyInput',
    component: MoneyInput,
    ...withDescription(import.meta.url, './money-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'number',
            description: 'The current value in minor units (e.g., cents)',
        },
        currency: {
            control: 'select',
            options: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
            description: 'The currency code',
        },
    },
} satisfies Meta<typeof MoneyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 9999,
        currency: 'USD',
    },
    render: args => {
        const [value, setValue] = useState(args.value as number);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: {((value || 0) / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value || 0}</div>
                </div>
            </div>
        );
    },
};

export const DifferentCurrencies: Story = {
    render: () => {
        const [usd, setUsd] = useState(9999);
        const [eur, setEur] = useState(12550);
        const [gbp, setGbp] = useState(4999);
        const [jpy, setJpy] = useState(100000);

        return (
            <div className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">USD</label>
                    <MoneyInput
                        value={usd}
                        onChange={setUsd}
                        currency="USD"
                        name="usd"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <div className="text-xs text-muted-foreground">${(usd / 100).toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">EUR</label>
                    <MoneyInput
                        value={eur}
                        onChange={setEur}
                        currency="EUR"
                        name="eur"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <div className="text-xs text-muted-foreground">€{(eur / 100).toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">GBP</label>
                    <MoneyInput
                        value={gbp}
                        onChange={setGbp}
                        currency="GBP"
                        name="gbp"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <div className="text-xs text-muted-foreground">£{(gbp / 100).toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">JPY</label>
                    <MoneyInput
                        value={jpy}
                        onChange={setJpy}
                        currency="JPY"
                        name="jpy"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <div className="text-xs text-muted-foreground">¥{(jpy / 100).toFixed(2)}</div>
                </div>
            </div>
        );
    },
};

export const LargeAmount: Story = {
    render: () => {
        const [value, setValue] = useState(999999999);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput
                    value={value}
                    onChange={setValue}
                    currency="USD"
                    name="large"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ${(value / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div>Stored value (minor units): {value.toLocaleString()}</div>
                </div>
            </div>
        );
    },
};
