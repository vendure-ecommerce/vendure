import {
    Component,
    booleanAttribute,
    computed,
    forwardRef,
    input,
    model,
    output,
    signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnCheckboxComponent } from '@spartan-ng/brain/checkbox';
import { hlm } from '@spartan-ng/brain/core';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

export const HLM_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HlmCheckboxComponent),
    multi: true,
};

@Component({
    selector: 'hlm-checkbox',
    standalone: true,
    imports: [BrnCheckboxComponent, NgIcon, HlmIconDirective],
    template: `
        <brn-checkbox
            [id]="id()"
            [name]="name()"
            [class]="_computedClass()"
            [checked]="checked()"
            [disabled]="state().disabled()"
            [required]="required()"
            [aria-label]="ariaLabel()"
            [aria-labelledby]="ariaLabelledby()"
            [aria-describedby]="ariaDescribedby()"
            (changed)="_handleChange()"
            (touched)="_onTouched?.()"
        >
            <ng-icon [class]="_computedIconClass()" hlm size="sm" name="lucideCheck" />
        </brn-checkbox>
    `,
    host: {
        class: 'contents',
        '[attr.id]': 'null',
        '[attr.aria-label]': 'null',
        '[attr.aria-labelledby]': 'null',
        '[attr.aria-describedby]': 'null',
    },
    providers: [HLM_CHECKBOX_VALUE_ACCESSOR],
    viewProviders: [provideIcons({ lucideCheck })],
})
export class HlmCheckboxComponent {
    public readonly userClass = input<ClassValue>('', { alias: 'class' });

    protected readonly _computedClass = computed(() =>
        hlm(
            'group inline-flex border border-muted-foreground shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' +
                ' focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:text-background data-[state=checked]:bg-accent-400 data-[state=unchecked]:bg-background',
            this.userClass(),
            this.state().disabled() ? 'cursor-not-allowed opacity-50' : '',
        ),
    );

    protected readonly _computedIconClass = computed(() =>
        hlm(
            'leading-none group-data-[state=unchecked]:opacity-0',
            this.checked() === 'indeterminate' ? 'opacity-50' : '',
        ),
    );

    /** Used to set the id on the underlying brn element. */
    public readonly id = input<string | null>(null);

    /** Used to set the aria-label attribute on the underlying brn element. */
    public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

    /** Used to set the aria-labelledby attribute on the underlying brn element. */
    public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

    /** Used to set the aria-describedby attribute on the underlying brn element. */
    public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

    /** The checked state of the checkbox. */
    public readonly checked = model<CheckboxValue>(false);

    /** The name attribute of the checkbox. */
    public readonly name = input<string | null>(null);

    /** Whether the checkbox is required. */
    public readonly required = input(false, { transform: booleanAttribute });

    /** Whether the checkbox is disabled. */
    public readonly disabled = input(false, { transform: booleanAttribute });

    protected readonly state = computed(() => ({
        disabled: signal(this.disabled()),
    }));

    public readonly changed = output<boolean>();

    protected _onChange?: ChangeFn<CheckboxValue>;
    protected _onTouched?: TouchFn;

    protected _handleChange(): void {
        if (this.state().disabled()) return;

        const previousChecked = this.checked();
        this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
        this._onChange?.(!previousChecked);
        this.changed.emit(!previousChecked);
    }

    /** CONROL VALUE ACCESSOR */
    writeValue(value: CheckboxValue): void {
        this.checked.set(!!value);
    }

    registerOnChange(fn: ChangeFn<CheckboxValue>): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: TouchFn): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.state().disabled.set(isDisabled);
    }
}

type CheckboxValue = boolean | 'indeterminate';
