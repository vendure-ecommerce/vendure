import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[vdrCustomFilterComponentHost]',
})
export class CustomFilterComponentDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
