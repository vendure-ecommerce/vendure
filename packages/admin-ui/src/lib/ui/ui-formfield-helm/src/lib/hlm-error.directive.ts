import { Directive } from '@angular/core';

@Directive({
	standalone: true,
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'hlm-error',
	host: {
		class: 'block text-destructive text-sm font-medium',
	},
})
export class HlmErrorDirective {}
