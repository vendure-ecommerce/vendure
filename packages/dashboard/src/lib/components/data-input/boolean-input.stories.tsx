import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BooleanInput } from './boolean-input.js';

const meta = {
    title: 'Form Components/BooleanInput',
    component: BooleanInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BooleanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
    render: () => {
        const [checked, setChecked] = useState(false);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">Enable notifications</label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'On' : 'Off'}</div>
            </div>
        );
    },
};

export const On: Story = {
    render: () => {
        const [checked, setChecked] = useState(true);
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">Dark mode</label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'On' : 'Off'}</div>
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
                    <BooleanInput value={checked} onChange={setChecked} />
                    <label className="text-sm">Enable two-factor authentication for enhanced security</label>
                </div>
                <div className="text-sm text-muted-foreground">Status: {checked ? 'Enabled ✓' : 'Disabled'}</div>
            </div>
        );
    },
};

export const MultipleSwitches: Story = {
    render: () => {
        const [autoSave, setAutoSave] = useState(true);
        const [spellCheck, setSpellCheck] = useState(false);
        const [syntaxHighlight, setSyntaxHighlight] = useState(true);
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Auto-save</label>
                        <BooleanInput value={autoSave} onChange={setAutoSave} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Spell check</label>
                        <BooleanInput value={spellCheck} onChange={setSpellCheck} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Syntax highlighting</label>
                        <BooleanInput value={syntaxHighlight} onChange={setSyntaxHighlight} />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    Enabled features:{' '}
                    {[autoSave && 'Auto-save', spellCheck && 'Spell check', syntaxHighlight && 'Syntax highlight']
                        .filter(Boolean)
                        .join(', ') || 'None'}
                </div>
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
                        <BooleanInput value={enabled} onChange={setEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Featured</label>
                            <p className="text-xs text-muted-foreground">Show on homepage</p>
                        </div>
                        <BooleanInput value={featured} onChange={setFeatured} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Track inventory</label>
                            <p className="text-xs text-muted-foreground">Monitor stock levels</p>
                        </div>
                        <BooleanInput value={trackInventory} onChange={setTrackInventory} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">Allow backorder</label>
                            <p className="text-xs text-muted-foreground">Accept orders when out of stock</p>
                        </div>
                        <BooleanInput value={allowBackorder} onChange={setAllowBackorder} />
                    </div>
                </div>
            </div>
        );
    },
};

export const StringValueTrue: Story = {
    render: () => {
        const [checked, setChecked] = useState('true');
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">String value: "true"</label>
                </div>
                <div className="text-sm text-muted-foreground">
                    Value: {typeof checked === 'string' ? `"${checked}" (string)` : `${checked} (boolean)`}
                </div>
            </div>
        );
    },
};

export const StringValueFalse: Story = {
    render: () => {
        const [checked, setChecked] = useState('false');
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput value={checked} onChange={setChecked} />
                    <label className="text-sm font-medium">String value: "false"</label>
                </div>
                <div className="text-sm text-muted-foreground">
                    Value: {typeof checked === 'string' ? `"${checked}" (string)` : `${checked} (boolean)`}
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
                    <BooleanInput value={true} onChange={() => {}} fieldDef={{ readonly: true }} />
                    <label className="text-sm font-medium text-muted-foreground">Disabled and on</label>
                </div>
                <div className="text-sm text-muted-foreground">This switch is disabled (fieldDef.readonly=true)</div>
            </div>
        );
    },
};

export const DisabledOff: Story = {
    render: () => {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <BooleanInput value={false} onChange={() => {}} fieldDef={{ readonly: true }} />
                    <label className="text-sm font-medium text-muted-foreground">Disabled and off</label>
                </div>
                <div className="text-sm text-muted-foreground">This switch is disabled</div>
            </div>
        );
    },
};
