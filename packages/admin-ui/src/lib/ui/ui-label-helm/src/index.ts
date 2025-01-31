import { NgModule } from '@angular/core';
import { HlmLabelDirective } from './lib/hlm-label.directive';

export * from './lib/hlm-label.directive';

@NgModule({
	imports: [HlmLabelDirective],
	exports: [HlmLabelDirective],
})
export class HlmLabelModule {}
