import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AffixedInput } from './affixed-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/AffixedInput',
    component: AffixedInput,
    ...withDescription(import.meta.url, './affixed-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        prefix: {
            control: 'text',
            description: 'Content to display before the input',
        },
        suffix: {
            control: 'text',
            description: 'Content to display after the input',
        },
        type: {
            control: 'select',
            options: ['text', 'number', 'email', 'url', 'tel'],
            description: 'Input type',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled',
        },
        value: {
            control: 'text',
            description: 'Input value',
        },
    },
} satisfies Meta<typeof AffixedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        prefix: '$',
        suffix: 'USD',
        value: '100.00',
        type: 'text',
        placeholder: 'Enter amount',
        disabled: false,
    },
    render: args => {
        const [value, setValue] = useState(args.value as string);
        return (
            <AffixedInput
                {...args}
                value={value}
                onChange={e => setValue(e.target.value)}
                name="playground"
                onBlur={() => {}}
                ref={() => {}}
            />
        );
    },
};

export const WithPrefix: Story = {
    render: () => {
        const [value, setValue] = useState('example.com');
        return (
            <AffixedInput
                prefix="https://"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter domain"
            />
        );
    },
};

export const WithSuffix: Story = {
    render: () => {
        const [value, setValue] = useState('25');
        return (
            <AffixedInput
                type="number"
                suffix="%"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter percentage"
            />
        );
    },
};

export const WithBothPrefixAndSuffix: Story = {
    render: () => {
        const [value, setValue] = useState('99.99');
        return (
            <AffixedInput
                type="number"
                prefix="$"
                suffix="USD"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter amount"
            />
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <AffixedInput
                prefix="https://"
                suffix=".com"
                value="example"
                disabled
                onChange={() => {}}
            />
        );
    },
};

export const WithLongAffix: Story = {
    render: () => {
        const [value, setValue] = useState('5000');
        return (
            <AffixedInput
                type="number"
                prefix="Price per unit:"
                suffix="credits/month"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
        );
    },
};

export const NumberWithSteps: Story = {
    render: () => {
        const [value, setValue] = useState('0.5');
        return (
            <AffixedInput
                type="number"
                suffix="kg"
                value={value}
                onChange={e => setValue(e.target.value)}
                step="0.1"
                min="0"
                max="100"
            />
        );
    },
};

export const EmailPrefix: Story = {
    render: () => {
        const [value, setValue] = useState('john.doe');
        return (
            <AffixedInput
                type="text"
                suffix="@company.com"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="username"
            />
        );
    },
};
