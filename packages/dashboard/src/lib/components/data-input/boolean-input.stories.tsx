import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BooleanInput } from './boolean-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/BooleanInput',
    component: BooleanInput,
    ...withDescription(import.meta.url, './boolean-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'boolean',
            description: 'Whether the switch is on',
        },
    },
} satisfies Meta<typeof BooleanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: false,
    },
    render: args => {
        const [checked, setChecked] = useState(args.value as boolean);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput
                        {...args}
                        value={checked}
                        onChange={setChecked}
                        name="playground"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <label className="text-sm font-medium">Enable notifications</label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'On' : 'Off'}</div>
            </div>
        );
    },
};

export const ProductSettings: Story = {
    render: () => {
        const [enabled, setEnabled] = useState(true);
        const [featured, setFeatured] = useState(false);
        const [trackInventory, setTrackInventory] = useState(true);
        const [allowBackorder, setAllowBackorder] = useState(false);
        return (
            <div className="w-[350px] space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Product enabled</label>
                            <p className="text-xs text-muted-foreground">Make this product visible in the catalog</p>
                        </div>
                        <BooleanInput
                            value={enabled}
                            onChange={setEnabled}
                            name="enabled"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Featured</label>
                            <p className="text-xs text-muted-foreground">Show on homepage</p>
                        </div>
                        <BooleanInput
                            value={featured}
                            onChange={setFeatured}
                            name="featured"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Track inventory</label>
                            <p className="text-xs text-muted-foreground">Monitor stock levels</p>
                        </div>
                        <BooleanInput
                            value={trackInventory}
                            onChange={setTrackInventory}
                            name="trackInventory"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Allow backorder</label>
                            <p className="text-xs text-muted-foreground">Accept orders when out of stock</p>
                        </div>
                        <BooleanInput
                            value={allowBackorder}
                            onChange={setAllowBackorder}
                            name="allowBackorder"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                    </div>
                </div>
            </div>
        );
    },
};

export const StringValues: Story = {
    render: () => {
        const [trueValue, setTrueValue] = useState('true');
        const [falseValue, setFalseValue] = useState('false');
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <BooleanInput
                            value={trueValue}
                            onChange={setTrueValue}
                            name="string-true"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                        <label className="text-sm font-medium">String value: "true"</label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Value: {typeof trueValue === 'string' ? `"${trueValue}" (string)` : `${trueValue} (boolean)`}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <BooleanInput
                            value={falseValue}
                            onChange={setFalseValue}
                            name="string-false"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                        <label className="text-sm font-medium">String value: "false"</label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Value:{' '}
                        {typeof falseValue === 'string' ? `"${falseValue}" (string)` : `${falseValue} (boolean)`}
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">
                    Demonstrates handling of string "true"/"false" values
                </div>
            </div>
        );
    },
};
