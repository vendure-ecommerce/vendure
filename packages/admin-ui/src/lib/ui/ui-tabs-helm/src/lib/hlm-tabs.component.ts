import { Component, input } from '@angular/core';
import { BrnTabsDirective } from '@spartan-ng/brain/tabs';

@Component({
	selector: 'hlm-tabs',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTabsDirective,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	template: '<ng-content/>',
})
export class HlmTabsComponent {
	public readonly tab = input.required<string>();
}
