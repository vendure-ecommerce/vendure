import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const alertVariants = cva(
    'relative w-full rounded-lg border border-border p-4 [&>[hlmAlertIcon]]:absolute [&>[hlmAlertIcon]]:text-foreground [&>[hlmAlertIcon]]:left-4 [&>[hlmAlertIcon]]:top-4 [&>[hlmAlertIcon]+div]:translate-y-[-3px] [&>[hlmAlertIcon]~*]:pl-7',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                destructive:
                    'text-destructive border-destructive/50 dark:border-destructive [&>[hlmAlertIcon]]:text-destructive bg-destructive/10',
                warning:
                    'text-yellow-500 border-yellow-500/50 dark:border-yellow-500 [&>[hlmAlertIcon]]:text-yellow-500 bg-yellow-300/10',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);
export type AlertVariants = VariantProps<typeof alertVariants>;

@Directive({
    selector: '[hlmAlert]',
    standalone: true,
    host: {
        role: 'alert',
        '[class]': '_computedClass()',
    },
})
export class HlmAlertDirective {
    public readonly userClass = input<ClassValue>('', { alias: 'class' });
    protected readonly _computedClass = computed(() =>
        hlm(alertVariants({ variant: this.variant() }), this.userClass()),
    );

    public readonly variant = input<AlertVariants['variant']>('default');
}
