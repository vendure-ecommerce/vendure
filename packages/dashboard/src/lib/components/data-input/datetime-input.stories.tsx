import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DateTimeInput } from './datetime-input.js';

const meta = {
    title: 'Form Components/DateTimeInput',
    component: DateTimeInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(null);
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput value={value} onChange={setValue} />
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

export const WithInitialValue: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(new Date('2024-06-15T14:30:00').toISOString());
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput value={value} onChange={setValue} />
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

export const CurrentDateTime: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(new Date().toISOString());
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput value={value} onChange={setValue} />
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

export const Readonly: Story = {
    render: () => {
        const value = new Date('2024-12-25T09:00:00').toISOString();
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput value={value} onChange={() => {}} fieldDef={{ readonly: true }} />
                <div className="text-sm text-muted-foreground">
                    This input is readonly (fieldDef.readonly=true). The picker will not open.
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
                <DateTimeInput value={value} onChange={setValue} />
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

export const PastDate: Story = {
    render: () => {
        const [value, setValue] = useState<string | null>(new Date('2020-01-01T00:00:00').toISOString());
        return (
            <div className="w-[400px] space-y-2">
                <DateTimeInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    {value ? (
                        <>
                            <div>Selected: {new Date(value).toLocaleString()}</div>
                            <div className="text-xs mt-1">
                                {Math.floor((Date.now() - new Date(value).getTime()) / 86400000)} days ago
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
                <DateTimeInput value={value} onChange={setValue} />
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
