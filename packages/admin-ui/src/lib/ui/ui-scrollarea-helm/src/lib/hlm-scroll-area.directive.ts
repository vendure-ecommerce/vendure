import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ng-scrollbar[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[style.--scrollbar-border-radius.px]': '100',
		'[style.--scrollbar-offset]': '3',
		'[style.--scrollbar-thumb-color]': '"hsl(var(--border))"',
		'[style.--scrollbar-thumb-hover-color]': '"hsl(var(--border))"',
		'[style.--scrollbar-thickness]': '7',
	},
})
export class HlmScrollAreaDirective {
	protected readonly _computedClass = computed(() => hlm('block', this.userClass()));
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
}
