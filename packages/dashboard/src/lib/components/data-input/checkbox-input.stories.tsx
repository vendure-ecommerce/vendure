import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxInput } from './checkbox-input.js';

const meta = {
    title: 'Form Components/CheckboxInput',
    component: CheckboxInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckboxInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">Accept terms and conditions</label>
                </div>
                <div className="text-sm text-muted-foreground">
                    Status: {checked ? 'Checked ✓' : 'Unchecked'}
                </div>
            </div>
        );
    },
};

export const Checked: Story = {
    render: () => {
        const [checked, setChecked] = useState(true);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckboxInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">Subscribe to newsletter</label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'Checked ✓' : 'Unchecked'}</div>
            </div>
        );
    },
};

export const WithLabel: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckboxInput value={checked} onChange={setChecked} />
                    <label className="text-sm">
                        I agree to the <span className="underline">terms of service</span> and{' '}
                        <span className="underline">privacy policy</span>
                    </label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'Checked ✓' : 'Unchecked'}</div>
            </div>
        );
    },
};

export const MultipleCheckboxes: Story = {
    render: () => {
        const [notifications, setNotifications] = useState(true);
        const [marketing, setMarketing] = useState(false);
        const [updates, setUpdates] = useState(true);
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={notifications} onChange={setNotifications} />
                        <label className="text-sm font-medium">Email notifications</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={marketing} onChange={setMarketing} />
                        <label className="text-sm font-medium">Marketing emails</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={updates} onChange={setUpdates} />
                        <label className="text-sm font-medium">Product updates</label>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    Selected:{' '}
                    {[notifications && 'Notifications', marketing && 'Marketing', updates && 'Updates']
                        .filter(Boolean)
                        .join(', ') || 'None'}
                </div>
            </div>
        );
    },
};

export const ProductFeatures: Story = {
    render: () => {
        const [enabled, setEnabled] = useState(true);
        const [featured, setFeatured] = useState(false);
        const [trackInventory, setTrackInventory] = useState(true);
        return (
            <div className="w-[300px] space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={enabled} onChange={setEnabled} />
                        <label className="text-sm font-medium">Product enabled</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={featured} onChange={setFeatured} />
                        <label className="text-sm font-medium">Featured product</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput value={trackInventory} onChange={setTrackInventory} />
                        <label className="text-sm font-medium">Track inventory</label>
                    </div>
                </div>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckboxInput value={true} onChange={() => {}} fieldDef={{ readonly: true }} />
                    <label className="text-sm font-medium text-muted-foreground">Disabled and checked</label>
                </div>
                <div className="text-sm text-muted-foreground">This checkbox is disabled (fieldDef.readonly=true)</div>
            </div>
        );
    },
};

export const DisabledUnchecked: Story = {
    render: () => {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <CheckboxInput value={false} onChange={() => {}} fieldDef={{ readonly: true }} />
                    <label className="text-sm font-medium text-muted-foreground">Disabled and unchecked</label>
                </div>
                <div className="text-sm text-muted-foreground">This checkbox is disabled</div>
            </div>
        );
    },
};
