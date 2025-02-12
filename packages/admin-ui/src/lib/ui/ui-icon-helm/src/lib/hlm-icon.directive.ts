import { Directive, computed, input } from '@angular/core';
import { injectHlmIconConfig } from './hlm-icon.token';

export type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'none' | (Record<never, never> & string);

@Directive({
	selector: 'ng-icon[hlm]',
	standalone: true,
	host: {
		'[style.--ng-icon__size]': '_computedSize()',
	},
})
export class HlmIconDirective {
	private readonly _config = injectHlmIconConfig();
	public readonly size = input<IconSize>(this._config.size);

	protected readonly _computedSize = computed(() => {
		const size = this.size();

		switch (size) {
			case 'xs':
				return '12px';
			case 'sm':
				return '16px';
			case 'base':
				return '24px';
			case 'lg':
				return '32px';
			case 'xl':
				return '48px';
			default: {
				return size;
			}
		}
	});
}
