import { Directive, type DoCheck, Injector, computed, effect, inject, input, signal } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { hlm } from '@spartan-ng/brain/core';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';

import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
    'flex rounded-md border font-normal border-input bg-white text-base md:text-sm ring-offset-background file:border-0 file:text-foreground file:bg-white file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                default: 'h-10 py-2 px-4 file:max-md:py-0',
                sm: 'h-9 px-3 file:md:py-2 file:max-md:py-1.5',
                lg: 'h-11 px-8 file:md:py-3 file:max-md:py-2.5',
            },
            error: {
                auto: '[&.ng-invalid.ng-touched]:text-destructive [&.ng-invalid.ng-touched]:border-destructive [&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
                true: 'text-destructive border-destructive focus-visible:ring-destructive',
            },
        },
        defaultVariants: {
            size: 'default',
            error: 'auto',
        },
    },
);
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
    selector: '[hlmInput]',
    standalone: true,
    host: {
        '[class]': '_computedClass()',
    },
    providers: [
        {
            provide: BrnFormFieldControl,
            useExisting: HlmInputDirective,
        },
    ],
})
export class HlmInputDirective implements BrnFormFieldControl, DoCheck {
    public readonly size = input<InputVariants['size']>('default');

    public readonly error = input<InputVariants['error']>('auto');

    protected readonly state = computed(() => ({
        error: signal(this.error()),
    }));

    public readonly userClass = input<ClassValue>('', { alias: 'class' });
    protected readonly _computedClass = computed(() =>
        hlm(inputVariants({ size: this.size(), error: this.state().error() }), this.userClass()),
    );

    private readonly _injector = inject(Injector);

    public readonly ngControl: NgControl | null = this._injector.get(NgControl, null);

    private readonly _errorStateTracker: ErrorStateTracker;

    private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
    private readonly _parentForm = inject(NgForm, { optional: true });
    private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

    public readonly errorState = computed(() => this._errorStateTracker.errorState());

    constructor() {
        this._errorStateTracker = new ErrorStateTracker(
            this._defaultErrorStateMatcher,
            this.ngControl,
            this._parentFormGroup,
            this._parentForm,
        );

        effect(
            () => {
                if (this.ngControl) {
                    this.setError(this._errorStateTracker.errorState());
                }
            },
            { allowSignalWrites: true },
        );
    }

    ngDoCheck() {
        this._errorStateTracker.updateErrorState();
    }

    setError(error: InputVariants['error']) {
        this.state().error.set(error);
    }
}
