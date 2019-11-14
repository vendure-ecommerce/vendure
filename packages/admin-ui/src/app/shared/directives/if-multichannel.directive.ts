import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { DataService } from '../../data/providers/data.service';

import { IfDirectiveBase } from './if-directive-base';

@Directive({
    selector: '[vdrIfMultichannel]',
})
export class IfMultichannelDirective extends IfDirectiveBase<[]> {
    constructor(
        _viewContainer: ViewContainerRef,
        templateRef: TemplateRef<any>,
        private dataService: DataService,
    ) {
        super(_viewContainer, templateRef, () => {
            return this.dataService.client
                .userStatus()
                .mapStream(({ userStatus }) => 1 < userStatus.channels.length);
        });
    }

    /**
     * A template to show if the current user does not have the speicified permission.
     */
    @Input()
    set vdrIfMultichannelElse(templateRef: TemplateRef<any> | null) {
        this.setElseTemplate(templateRef);
    }
}
