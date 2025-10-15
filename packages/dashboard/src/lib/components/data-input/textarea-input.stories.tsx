import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextareaInput } from './textarea-input.js';

const meta = {
    title: 'Form Components/TextareaInput',
    component: TextareaInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TextareaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    Character count: {(value as string)?.length || 0}
                </div>
            </div>
        );
    },
};

export const WithInitialValue: Story = {
    render: () => {
        const [value, setValue] = useState(
            'This is some initial text.\nIt has multiple lines.\nYou can edit it freely.',
        );
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    Character count: {(value as string)?.length || 0}
                </div>
            </div>
        );
    },
};

export const LongText: Story = {
    render: () => {
        const [value, setValue] = useState(
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
        );
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    <div>Character count: {(value as string)?.length || 0}</div>
                    <div>Line count: {(value as string)?.split('\n').length || 0}</div>
                </div>
            </div>
        );
    },
};

export const ProductDescription: Story = {
    render: () => {
        const [value, setValue] = useState(
            'Premium cotton t-shirt with a comfortable fit.\n\nFeatures:\n- 100% organic cotton\n- Machine washable\n- Available in multiple colors\n- Sizes S-XXL',
        );
        return (
            <div className="w-[500px] space-y-2">
                <label className="text-sm font-medium">Product Description</label>
                <TextareaInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    Character count: {(value as string)?.length || 0}
                </div>
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => {
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput
                    value="This textarea is disabled and cannot be edited."
                    onChange={() => {}}
                    disabled
                />
                <div className="text-sm text-muted-foreground">This input is disabled</div>
            </div>
        );
    },
};

export const Readonly: Story = {
    render: () => {
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput
                    value="This textarea is readonly and cannot be edited."
                    onChange={() => {}}
                    fieldDef={{ readonly: true }}
                />
                <div className="text-sm text-muted-foreground">This input is readonly (fieldDef.readonly=true)</div>
            </div>
        );
    },
};

export const Empty: Story = {
    render: () => {
        const [value, setValue] = useState('');
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput value={value} onChange={setValue} />
                <div className="text-sm text-muted-foreground">
                    {value ? `Character count: ${(value as string).length}` : 'Empty - start typing...'}
                </div>
            </div>
        );
    },
};
