import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[hlmBreadcrumbSeparator]',
    standalone: true,
    imports: [NgIcon, HlmIconDirective],
    providers: [provideIcons({ lucideChevronRight })],
    host: {
        role: 'presentation',
        '[class]': '_computedClass()',
        '[attr.aria-hidden]': 'true',
    },
    template: `
        <ng-content>
            <ng-icon size="sm" hlm name="lucideChevronRight" />
        </ng-content>
    `,
})
export class HlmBreadcrumbSeparatorComponent {
    public readonly userClass = input<ClassValue>('', { alias: 'class' });

    protected readonly _computedClass = computed(() =>
        hlm('[&>hlm-icon]:w-3.5 flex items-center [&>hlm-icon]:h-3.5 ', this.userClass()),
    );
}
