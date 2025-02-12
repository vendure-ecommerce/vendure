import { NgModule } from '@angular/core';
import { HlmIconDirective } from './lib/hlm-icon.directive';

export * from './lib/hlm-icon.directive';
export * from './lib/hlm-icon.token';

@NgModule({
	imports: [HlmIconDirective],
	exports: [HlmIconDirective],
})
export class HlmIconModule {}
