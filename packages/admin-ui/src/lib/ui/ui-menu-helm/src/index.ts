import { NgModule } from '@angular/core';

import { HlmMenuBarItemDirective } from './lib/hlm-menu-bar-item.directive';
import { HlmMenuBarComponent } from './lib/hlm-menu-bar.component';
import { HlmMenuGroupComponent } from './lib/hlm-menu-group.component';
import { HlmMenuItemCheckComponent } from './lib/hlm-menu-item-check.component';
import { HlmMenuItemCheckboxDirective } from './lib/hlm-menu-item-checkbox.directive';
import { HlmMenuItemIconDirective } from './lib/hlm-menu-item-icon.directive';
import { HlmMenuItemRadioComponent } from './lib/hlm-menu-item-radio.component';
import { HlmMenuItemRadioDirective } from './lib/hlm-menu-item-radio.directive';
import { HlmMenuItemSubIndicatorComponent } from './lib/hlm-menu-item-sub-indicator.component';
import { HlmMenuItemDirective } from './lib/hlm-menu-item.directive';
import { HlmMenuLabelComponent } from './lib/hlm-menu-label.component';
import { HlmMenuSeparatorComponent } from './lib/hlm-menu-separator.component';
import { HlmMenuShortcutComponent } from './lib/hlm-menu-shortcut.component';
import { HlmMenuComponent } from './lib/hlm-menu.component';
import { HlmSubMenuComponent } from './lib/hlm-sub-menu.component';

export * from './lib/hlm-menu-bar-item.directive';
export * from './lib/hlm-menu-bar.component';
export * from './lib/hlm-menu-group.component';
export * from './lib/hlm-menu-item-check.component';
export * from './lib/hlm-menu-item-checkbox.directive';
export * from './lib/hlm-menu-item-icon.directive';
export * from './lib/hlm-menu-item-radio.component';
export * from './lib/hlm-menu-item-radio.directive';
export * from './lib/hlm-menu-item-sub-indicator.component';
export * from './lib/hlm-menu-item.directive';
export * from './lib/hlm-menu-label.component';
export * from './lib/hlm-menu-separator.component';
export * from './lib/hlm-menu-shortcut.component';
export * from './lib/hlm-menu.component';
export * from './lib/hlm-sub-menu.component';

export const HlmMenuItemImports = [
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuGroupComponent,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuItemRadioComponent,
	HlmMenuItemCheckComponent,
	HlmMenuShortcutComponent,
	HlmMenuItemCheckboxDirective,
	HlmMenuItemRadioDirective,
];
export const HlmMenuStructureImports = [HlmMenuLabelComponent, HlmMenuSeparatorComponent] as const;
export const HlmMenuImports = [
	...HlmMenuItemImports,
	...HlmMenuStructureImports,
	HlmMenuComponent,
	HlmSubMenuComponent,
] as const;
export const HlmMenuBarImports = [...HlmMenuImports, HlmMenuBarComponent, HlmMenuBarItemDirective] as const;

@NgModule({
	imports: [...HlmMenuItemImports],
	exports: [...HlmMenuItemImports],
})
export class HlmMenuItemModule {}

@NgModule({
	imports: [...HlmMenuImports],
	exports: [...HlmMenuImports],
})
export class HlmMenuModule {}

@NgModule({
	imports: [...HlmMenuBarImports],
	exports: [...HlmMenuBarImports],
})
export class HlmMenuBarModule {}
