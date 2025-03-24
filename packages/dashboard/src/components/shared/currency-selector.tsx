import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { Badge } from '@/components/ui/badge.js';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button.js';
import { CurrencyCode } from '@/constants.js';
import { useState } from 'react';

export interface CurrencySelectorProps<T extends boolean> {    
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
    availableCurrencyCodes?: string[];
}

export function CurrencySelector<T extends boolean>(props: CurrencySelectorProps<T>) {
    const { formatCurrencyName } = useLocalFormat();
    const { value, onChange, multiple, availableCurrencyCodes } = props;
    const [search, setSearch] = useState("");

    const filteredCurrencies = availableCurrencyCodes ?? Object.values(CurrencyCode).filter(currencyCode =>
        formatCurrencyName(currencyCode).toLowerCase().includes(search.toLowerCase())
    );

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
            const selectedCurrencies = value as string[];
            return (
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-full justify-between",
                        "min-h-[2.5rem] h-auto",
                        "flex flex-wrap gap-1 p-1"
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedCurrencies.length > 0 ? (
                            selectedCurrencies.map(currencyCode => (
                                <Badge
                                    key={currencyCode}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {formatCurrencyName(currencyCode)}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(currencyCode);
                                        }}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">Select currencies</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            );
        }
        return (
            <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
            >
                {value ? formatCurrencyName(value as string) : "Select a currency"}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {renderTrigger()}
            </PopoverTrigger>
            <PopoverContent 
                className="w-[200px] p-0" 
                side="bottom" 
                align="start"
            >
                <div className="p-2">
                    <input
                        type="text"
                        placeholder="Search currencies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                    />
                </div>
                <div className="max-h-[300px] overflow-auto">
                    {filteredCurrencies.map(currencyCode => (
                        <button
                            key={currencyCode}
                            onClick={() => handleSelect(currencyCode)}
                            className={cn(
                                "w-full px-2 py-1.5 text-sm text-left hover:bg-accent",
                                multiple && (value as string[]).includes(currencyCode) && "bg-accent"
                            )}
                        >
                            {formatCurrencyName(currencyCode)}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
