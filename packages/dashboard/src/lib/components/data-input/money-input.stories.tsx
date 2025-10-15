import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MoneyInput } from './money-input.js';

const meta = {
    title: 'Form Components/MoneyInput',
    component: MoneyInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MoneyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const USD: Story = {
    render: () => {
        const [value, setValue] = useState(9999);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="USD" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ${(value / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value}</div>
                </div>
            </div>
        );
    },
};

export const EUR: Story = {
    render: () => {
        const [value, setValue] = useState(12550);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="EUR" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: €{(value / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value}</div>
                </div>
            </div>
        );
    },
};

export const GBP: Story = {
    render: () => {
        const [value, setValue] = useState(4999);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="GBP" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: £{(value / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value}</div>
                </div>
            </div>
        );
    },
};

export const JPY: Story = {
    render: () => {
        const [value, setValue] = useState(100000);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="JPY" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ¥{(value / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value}</div>
                    <div className="text-xs mt-1">Note: JPY typically has no decimal places in real usage</div>
                </div>
            </div>
        );
    },
};

export const ZeroValue: Story = {
    render: () => {
        const [value, setValue] = useState(0);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="USD" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ${(value / 100).toFixed(2)}</div>
                    <div>Stored value: {value}</div>
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
                <MoneyInput value={value} onChange={setValue} currency="USD" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ${(value / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div>Stored value (minor units): {value.toLocaleString()}</div>
                </div>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={5000} onChange={() => {}} currency="USD" fieldDef={{ readonly: true }} />
                <div className="text-sm text-muted-foreground">This input is readonly</div>
            </div>
        );
    },
};

export const Interactive: Story = {
    render: () => {
        const [value, setValue] = useState(2500);
        return (
            <div className="w-[300px] space-y-2">
                <MoneyInput value={value} onChange={setValue} currency="USD" />
                <div className="text-sm text-muted-foreground">
                    <div>Display value: ${(value / 100).toFixed(2)}</div>
                    <div>Stored value (minor units): {value}</div>
                    <div className="text-xs mt-2">
                        Try:
                        <ul className="list-disc ml-4 mt-1">
                            <li>Typing decimal values</li>
                            <li>Using arrow keys to increment/decrement</li>
                            <li>Clearing the field (becomes 0 on blur)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
};
