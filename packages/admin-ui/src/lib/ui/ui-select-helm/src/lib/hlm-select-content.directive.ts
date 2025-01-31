import { Directive, computed, input } from '@angular/core';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSelectContent], hlm-select-content',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': '_stateProvider?.state() ?? "open"',
		'[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
	},
})
export class HlmSelectContentDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly stickyLabels = input<boolean>(false);
	protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
	protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

	protected readonly _computedClass = computed(() =>
		hlm(
			'w-full relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 data-[side=bottom]:top-[2px] data-[side=top]:bottom-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this.userClass(),
		),
	);
}
