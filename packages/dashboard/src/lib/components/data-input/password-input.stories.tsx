import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordInput } from './password-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/PasswordInput',
    component: PasswordInput,
    ...withDescription(import.meta.url, './password-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'The current password value',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled',
        },
    },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 'secret123',
        disabled: false,
    },
    render: args => {
        const [value, setValue] = useState(args.value as string);
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    Password length: {value?.length || 0} characters
                </div>
            </div>
        );
    },
};

export const ChangePassword: Story = {
    render: () => {
        const [currentPassword, setCurrentPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        return (
            <div className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <PasswordInput
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        name="current"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <PasswordInput
                        value={newPassword}
                        onChange={setNewPassword}
                        name="new"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <PasswordInput
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        name="confirm"
                        onBlur={() => {}}
                        ref={() => {}}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {newPassword && confirmPassword && newPassword === confirmPassword ? (
                        <span className="text-green-600">Passwords match ✓</span>
                    ) : newPassword && confirmPassword ? (
                        <span className="text-red-600">Passwords do not match ✗</span>
                    ) : (
                        <span>Enter and confirm your new password</span>
                    )}
                </div>
            </div>
        );
    },
};
