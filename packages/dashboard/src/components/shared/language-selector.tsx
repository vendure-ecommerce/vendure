import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { Badge } from '@/components/ui/badge.js';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button.js';

const availableGlobalLanguages = graphql(`
    query AvailableGlobalLanguages {
        globalSettings {
            availableLanguages
        }
    }
`);

export interface LanguageSelectorProps<T extends boolean> {
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
    availableLanguageCodes?: string[];
}

export function LanguageSelector<T extends boolean>(props: LanguageSelectorProps<T>) {
    const { data } = useQuery({
        queryKey: ['availableGlobalLanguages'],
        queryFn: () => api.query(availableGlobalLanguages),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const { formatLanguageName } = useLocalFormat();
    const { value, onChange, multiple, availableLanguageCodes } = props;

    const handleSelect = (selectedValue: string) => {
        if (multiple) {
            const currentValue = value as string[];
            const newValue = currentValue.includes(selectedValue)
                ? currentValue.filter(v => v !== selectedValue)
                : [...currentValue, selectedValue];
            onChange(newValue as T extends true ? string[] : string);
        } else {
            onChange(selectedValue as T extends true ? string[] : string);
        }
    };

    const handleRemove = (languageToRemove: string) => {
        if (multiple) {
            const currentValue = value as string[];
            onChange(currentValue.filter(v => v !== languageToRemove) as T extends true ? string[] : string);
        }
    };

    const renderTrigger = () => {
        if (multiple) {
            const selectedLanguages = value as string[];
            return (
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        'w-full justify-between',
                        'min-h-[2.5rem] h-auto',
                        'flex flex-wrap gap-1 p-1',
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedLanguages.length > 0 ? (
                            selectedLanguages.map(language => (
                                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                                    {formatLanguageName(language)}
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleRemove(language);
                                        }}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">Select languages</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            );
        }
        return (
            <Button variant="outline" role="combobox" className="w-full justify-between">
                {value ? formatLanguageName(value as string) : 'Select a language'}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="max-h-[300px] overflow-auto">
                    {(availableLanguageCodes ?? data?.globalSettings.availableLanguages)?.map(language => (
                        <button
                            key={language}
                            onClick={() => handleSelect(language)}
                            className={cn(
                                'w-full px-2 py-1.5 text-sm text-left hover:bg-accent',
                                multiple && (value as string[]).includes(language) && 'bg-accent',
                            )}
                        >
                            {formatLanguageName(language)}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
