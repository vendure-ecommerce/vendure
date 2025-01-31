import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnSelectOptionDirective } from '@spartan-ng/brain/select';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnSelectOptionDirective, inputs: ['disabled', 'value'] }],
	providers: [provideIcons({ lucideCheck })],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content />
		<span
			[attr.dir]="_brnSelectOption.dir()"
			class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center rtl:left-auto rtl:right-2"
			[attr.data-state]="this._brnSelectOption.checkedState()"
		>
			@if (this._brnSelectOption.selected()) {
				<ng-icon hlm aria-hidden="true" name="lucideCheck" />
			}
		</span>
	`,
	imports: [NgIcon, HlmIconDirective],
})
export class HlmSelectOptionComponent {
	protected readonly _brnSelectOption = inject(BrnSelectOptionDirective, { host: true });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2  rtl:flex-reverse rtl:pr-8 rtl:pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			this.userClass(),
		),
	);
}
