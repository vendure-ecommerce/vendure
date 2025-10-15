import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './number-input.js';

const meta = {
    title: 'Form Components/NumberInput',
    component: NumberInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(42);
        return (
            <div className="w-[300px]">
                <NumberInput value={value} onChange={setValue} />
                <div className="mt-2 text-sm text-muted-foreground">Value: {value}</div>
            </div>
        );
    },
};

export const WithMinMax: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(50);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={value} onChange={setValue} min={0} max={100} />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}</div>
                    <div>Range: 0-100</div>
                </div>
            </div>
        );
    },
};

export const Float: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(3.14159);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={value} onChange={setValue} step={0.01} fieldDef={{ type: 'float' }} />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}</div>
                    <div>Step: 0.01</div>
                </div>
            </div>
        );
    },
};

export const WithPrefix: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(99.99);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput
                    value={value}
                    onChange={setValue}
                    step={0.01}
                    fieldDef={{ type: 'float', ui: { prefix: '$' } }}
                />
                <div className="text-sm text-muted-foreground">Value: ${value}</div>
            </div>
        );
    },
};

export const WithSuffix: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(25);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={value} onChange={setValue} fieldDef={{ ui: { suffix: '%' } }} min={0} max={100} />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}%</div>
                    <div>Range: 0-100</div>
                </div>
            </div>
        );
    },
};

export const WithPrefixAndSuffix: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(1500);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput
                    value={value}
                    onChange={setValue}
                    fieldDef={{ ui: { prefix: '$', suffix: 'USD' } }}
                    step={10}
                />
                <div className="text-sm text-muted-foreground">Value: ${value} USD</div>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={100} onChange={() => {}} disabled />
                <div className="text-sm text-muted-foreground">This input is disabled</div>
            </div>
        );
    },
};

export const Readonly: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={500} onChange={() => {}} fieldDef={{ readonly: true }} />
                <div className="text-sm text-muted-foreground">This input is readonly (fieldDef.readonly=true)</div>
            </div>
        );
    },
};

export const CustomStep: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(0);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={value} onChange={setValue} step={5} min={0} max={100} />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}</div>
                    <div>Step: 5</div>
                </div>
            </div>
        );
    },
};

export const NullValue: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(null);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    Value: {value === null ? 'null' : value}
                    <div className="mt-1 text-xs">When input is cleared, value becomes null</div>
                </div>
            </div>
        );
    },
};
