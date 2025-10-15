import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextareaInput } from './textarea-input.js';
import { withDescription } from '../../../.storybook/with-description.js';

const meta = {
    title: 'Form Components/TextareaInput',
    component: TextareaInput,
    ...withDescription(import.meta.url, './textarea-input.js'),
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'The current value',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the textarea is disabled',
        },
    },
} satisfies Meta<typeof TextareaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 'Edit this text!\nMultiple lines supported.',
        disabled: false,
    },
    render: args => {
        const [value, setValue] = useState(args.value as string);
        return (
            <div className="w-[500px] space-y-2">
                <TextareaInput
                    {...args}
                    value={value}
                    onChange={setValue}
                    name="playground"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    Characters: {value?.length || 0} | Lines: {value?.split('\n').length || 0}
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
                <TextareaInput
                    value={value}
                    onChange={setValue}
                    name="long-text"
                    onBlur={() => {}}
                    ref={() => {}}
                />
                <div className="text-sm text-muted-foreground">
                    <div>Character count: {value?.length || 0}</div>
                    <div>Line count: {value?.split('\n').length || 0}</div>
                </div>
            </div>
        );
    },
};
