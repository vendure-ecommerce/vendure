import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextInput } from './text-input.js';

const meta = {
    title: 'Form Components/TextInput',
    component: TextInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px] space-y-2">
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    {value ? `Value: "${value}"` : 'Empty - start typing...'}
                </div>
            </div>
        );
    },
};

export const WithInitialValue: Story = {
    render: () => {
        const [value, setValue] = useState('Initial text value');
        return (
            <div className="w-[300px] space-y-2">
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">Value: "{value}"</div>
            </div>
        );
    },
};

export const ProductName: Story = {
    render: () => {
        const [value, setValue] = useState('Premium Cotton T-Shirt');
        return (
            <div className="w-[300px] space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">Character count: {value?.length || 0}</div>
            </div>
        );
    },
};

export const Email: Story = {
    render: () => {
        const [value, setValue] = useState('user@example.com');
        return (
            <div className="w-[300px] space-y-2">
                <label className="text-sm font-medium">Email</label>
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">Value: {value}</div>
            </div>
        );
    },
};

export const Username: Story = {
    render: () => {
        const [value, setValue] = useState('john_doe_123');
        return (
            <div className="w-[300px] space-y-2">
                <label className="text-sm font-medium">Username</label>
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    <div>Value: {value}</div>
                    <div className="text-xs mt-1">Length: {value?.length || 0} characters</div>
                </div>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <TextInput value="Disabled input" onChange={() => {}} fieldDef={{ readonly: true }} />
                <div className="text-sm text-muted-foreground">This input is disabled (fieldDef.readonly=true)</div>
            </div>
        );
    },
};

export const Empty: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px] space-y-2">
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">{value ? `Value: "${value}"` : 'No value yet'}</div>
            </div>
        );
    },
};

export const LongText: Story = {
    render: () => {
        const [value, setValue] = useState(
            'This is a very long text input value that will overflow the input field width',
        );
        return (
            <div className="w-[300px] space-y-2">
                <TextInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    <div className="break-all">Value: "{value}"</div>
                    <div>Length: {value?.length} characters</div>
                </div>
            </div>
        );
    },
};
