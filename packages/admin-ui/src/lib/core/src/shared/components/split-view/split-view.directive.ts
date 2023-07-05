import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[vdrSplitViewLeft]',
})
export class SplitViewLeftDirective {}

@Directive({
    selector: '[vdrSplitViewRight]',
})
export class SplitViewRightDirective {
    constructor(public template: TemplateRef<any>) {}
    @Input() splitViewTitle?: string;
}
