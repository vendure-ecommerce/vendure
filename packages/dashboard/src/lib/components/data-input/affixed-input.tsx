import { ReactNode, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input.js';

interface AffixedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    prefix?: ReactNode;
    suffix?: ReactNode;
}

export function AffixedInput({ prefix, suffix, className = '', ...props }: Readonly<AffixedInputProps>) {
    const prefixRef = useRef<HTMLSpanElement>(null);
    const suffixRef = useRef<HTMLSpanElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(0);
    const [suffixWidth, setSuffixWidth] = useState(0);

    useEffect(() => {
        if (prefixRef.current) {
            setPrefixWidth(Math.round(prefixRef.current.getBoundingClientRect().width));
        }
        if (suffixRef.current) {
            setSuffixWidth(Math.round(suffixRef.current.getBoundingClientRect().width));
        }
    }, [prefix, suffix]);

    const style = {
        paddingLeft: prefix ? `calc(1rem + ${prefixWidth}px)` : undefined,
        paddingRight: suffix ? `calc(1rem + ${suffixWidth}px)` : undefined,
    };

    return (
        <div className="relative flex items-center">
            {prefix && (
                <span ref={prefixRef} className="absolute left-3 text-muted-foreground whitespace-nowrap">
                    {prefix}
                </span>
            )}
            <Input {...props} className={className} style={style} />
            {suffix && (
                <span ref={suffixRef} className="absolute right-3 text-muted-foreground whitespace-nowrap">
                    {suffix}
                </span>
            )}
        </div>
    );
}
