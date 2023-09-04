import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { ComponentProps, createContext, createElement, ElementType } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HostedReactComponentContext } from './types';

export const HostedComponentContext = createContext<HostedReactComponentContext | null>(null);

/**
 * Based on https://netbasal.com/using-react-in-angular-applications-1bb907ecac91
 */
@Directive({
    selector: '[vdrReactComponentHost]',
    standalone: true,
})
export class ReactComponentHostDirective<Comp extends ElementType> {
    @Input('vdrReactComponentHost') reactComponent: Comp;
    @Input() props: ComponentProps<Comp>;
    @Input() context: Record<string, any> = {};

    private root: Root | null = null;

    constructor(private host: ElementRef, private injector: Injector) {}

    async ngOnChanges() {
        const Comp = this.reactComponent;

        if (!this.root) {
            this.root = createRoot(this.host.nativeElement);
        }

        this.root.render(
            createElement(
                HostedComponentContext.Provider,
                {
                    value: { ...this.props, ...this.context, injector: this.injector },
                },
                createElement(Comp, this.props),
            ),
        );
    }

    ngOnDestroy() {
        this.root?.unmount();
    }
}
