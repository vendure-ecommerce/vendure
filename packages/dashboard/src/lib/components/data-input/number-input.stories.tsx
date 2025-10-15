import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './number-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/NumberInput',
    component: NumberInput,
    ...withDescription(import.meta.url, './number-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'number',
            description: 'The current value',
        },
        min: {
            control: 'number',
            description: 'Minimum value',
        },
        max: {
            control: 'number',
            description: 'Maximum value',
        },
        step: {
            control: 'number',
            description: 'Step increment',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled',
        },
    },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 42,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
    },
    render: args => {
        const [value, setValue] = useState<number | null>(args.value as number);
        return (
            <div className="w-[300px]">
                <NumberInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="mt-2 text-sm text-muted-foreground">Value: {value}</div>
            </div>
        );
    },
};

export const Float: Story = {
    render: () => {
        const [value, setValue] = useState<number | null>(3.14159);
        return (
            <div className="w-[300px] space-y-2">
                <NumberInput
                    value={value}
                    onChange={setValue}
                    step={0.01}
                    fieldDef={{ type: 'float' }}
                    name="float"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}</div>
                    <div>Floating point with step 0.01</div>
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
                    name="with-affix"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    Demonstrates fieldDef.ui.prefix and fieldDef.ui.suffix
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
                <NumberInput
                    value={value}
                    onChange={setValue}
                    name="null-value"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    Value: {value === null ? 'null' : value}
                    <div className="mt-1 text-xs">When input is cleared, value becomes null</div>
                </div>
            </div>
        );
    },
};
