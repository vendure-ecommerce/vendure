import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'hlm-select-scroll-down',
	standalone: true,
	imports: [NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		class: 'flex cursor-default items-center justify-center py-1',
	},
	template: `
		<ng-icon hlm size="sm" class="ml-2" name="lucideChevronDown" />
	`,
})
export class HlmSelectScrollDownComponent {}
