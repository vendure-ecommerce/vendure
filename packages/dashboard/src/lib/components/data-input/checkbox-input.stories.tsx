import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxInput } from './checkbox-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/CheckboxInput',
    component: CheckboxInput,
    ...withDescription(import.meta.url, './checkbox-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'boolean',
            description: 'Whether the checkbox is checked',
        },
    },
} satisfies Meta<typeof CheckboxInput>;

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
                    <CheckboxInput
                        {...args}
                        value={checked}
                        onChange={setChecked}
                        name="playground"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                    <label className="text-sm font-medium">Accept terms and conditions</label>
                </div>
                <div className="text-sm text-muted-foreground">
                    Status: {checked ? 'Checked ✓' : 'Unchecked'}
                </div>
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
                        <CheckboxInput
                            value={notifications}
                            onChange={setNotifications}
                            name="notifications"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                        <label className="text-sm font-medium">Email notifications</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput
                            value={marketing}
                            onChange={setMarketing}
                            name="marketing"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
                        <label className="text-sm font-medium">Marketing emails</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckboxInput
                            value={updates}
                            onChange={setUpdates}
                            name="updates"
                            onBlur={() => {}}
                            ref={() => {}}
                        />
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
