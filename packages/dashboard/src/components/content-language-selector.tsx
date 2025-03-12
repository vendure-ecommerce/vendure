import * as React from 'react';
import { useServerConfig } from '@/providers/server-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ContentLanguageSelectorProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ContentLanguageSelector({ value, onChange, className }: ContentLanguageSelectorProps) {
    const serverConfig = useServerConfig();

    // Fallback to empty array if serverConfig is null
    const languages = serverConfig?.availableLanguages || [];

    // If no value is provided but languages are available, use the first language
    const currentValue = value || (languages.length > 0 ? languages[0] : '');

    return (
        <Select value={currentValue} onValueChange={onChange}>
            <SelectTrigger className={cn('w-[200px]', className)}>
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map(language => (
                    <SelectItem key={language} value={language}>
                        {language}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
