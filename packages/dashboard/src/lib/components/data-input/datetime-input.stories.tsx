import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DateTimeInput } from './datetime-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/DateTimeInput',
    component: DateTimeInput,
    ...withDescription(import.meta.url, './datetime-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'ISO 8601 datetime string',
        },
    },
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: new Date('2024-06-15T14:30:00').toISOString(),
    },
    render: args => {
        const [value, setValue] = useState<string | null>(args.value as string);
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    {value ? (
                        <>
                            <div>Selected: {new Date(value).toLocaleString()}</div>
                            <div className="text-xs mt-1">ISO: {value}</div>
                        </>
                    ) : (
                        <div>No date selected</div>
                    )}
                </div>
            </div>
        );
    },
};

export const FutureDate: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(new Date('2025-12-31T23:59:00').toISOString());
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput
                    value={value}
                    onChange={setValue}
                    name="future"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    {value ? (
                        <>
                            <div>Selected: {new Date(value).toLocaleString()}</div>
                            <div className="text-xs mt-1">
                                Time until: {Math.floor((new Date(value).getTime() - Date.now()) / 86400000)} days
                            </div>
                        </>
                    ) : (
                        <div>No date selected</div>
                    )}
                </div>
            </div>
        );
    },
};

export const ClearableValue: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(new Date().toISOString());
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput
                    value={value}
                    onChange={setValue}
                    name="clearable"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    {value ? (
                        <>
                            <div>Selected: {new Date(value).toLocaleString()}</div>
                            <div className="text-xs mt-1">Click the X button to clear the value</div>
                        </>
                    ) : (
                        <div>No date selected. Click to select a date and time.</div>
                    )}
                </div>
            </div>
        );
    },
};
