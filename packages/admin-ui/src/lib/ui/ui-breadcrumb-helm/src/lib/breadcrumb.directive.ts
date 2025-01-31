import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmBreadcrumb]',
	standalone: true,
	host: {
		role: 'navigation',
		'[class]': '_computedClass()',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmBreadcrumbDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly ariaLabel = input<string>('breadcrumb', { alias: 'aria-label' });

	protected readonly _computedClass = computed(() => hlm(this.userClass()));
}
