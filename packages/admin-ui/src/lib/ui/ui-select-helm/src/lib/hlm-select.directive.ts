import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-select, brn-select [hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('space-y-2', this.userClass()));
}
