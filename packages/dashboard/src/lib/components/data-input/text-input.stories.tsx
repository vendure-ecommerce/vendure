import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextInput } from './text-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/TextInput',
    component: TextInput,
    ...withDescription(import.meta.url, './text-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'The current value',
        },
    },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 'Edit me!',
    },
    render: args => {
        const [value, setValue] = useState(args.value as string);
        return (
            <div className="w-[300px] space-y-2">
                <TextInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    {value ? `Value: "${value}" (${value.length} chars)` : 'Empty'}
                </div>
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
                <TextInput
                    value={value}
                    onChange={setValue}
                    name="long-text"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    <div className="break-all">Value: "{value}"</div>
                    <div>Length: {value?.length} characters</div>
                </div>
            </div>
        );
    },
};
