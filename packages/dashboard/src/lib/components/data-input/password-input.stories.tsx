import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PasswordInput } from './password-input.js';

const meta = {
    title: 'Form Components/PasswordInput',
    component: PasswordInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    {value ? `Password length: ${(value as string).length} characters` : 'No password entered'}
                </div>
            </div>
        );
    },
};

export const WithInitialValue: Story = {
    render: () => {
        const [value, setValue] = useState('mySecretPassword123');
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    Password length: {(value as string).length} characters
                </div>
            </div>
        );
    },
};

export const LoginForm: Story = {
    render: () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        return (
            <div className="w-[300px] space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                        placeholder="Enter username"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <PasswordInput value={password} onChange={setPassword} />
                </div>
                <div className="text-sm text-muted-foreground">
                    {password ? `Password length: ${(password as string).length}` : 'Enter your password'}
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
                    <PasswordInput value={currentPassword} onChange={setCurrentPassword} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <PasswordInput value={newPassword} onChange={setNewPassword} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />
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

export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput value="disabledPassword123" onChange={() => {}} disabled />
                <div className="text-sm text-muted-foreground">This password input is disabled</div>
            </div>
        );
    },
};

export const Readonly: Story = {
    render: () => {
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput value="readonlyPassword123" onChange={() => {}} fieldDef={{ readonly: true }} />
                <div className="text-sm text-muted-foreground">This password input is readonly</div>
            </div>
        );
    },
};

export const Empty: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[300px] space-y-2">
                <PasswordInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    {value ? `${(value as string).length} characters entered` : 'Password field is empty'}
                </div>
            </div>
        );
    },
};
