import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from './input-group.js';

interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {}

function PasswordInput({ ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <InputGroup>
            <InputGroupInput type={showPassword ? 'text' : 'password'} {...props} />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export { PasswordInput };
