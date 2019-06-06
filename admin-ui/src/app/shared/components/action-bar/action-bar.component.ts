import { Component, ContentChild, Input, OnInit } from '@angular/core';

@Component({
    selector: 'vdr-ab-left',
    template: `
        <ng-content></ng-content>
    `,
})
export class ActionBarLeftComponent {
    @Input() grow = false;
}

@Component({
    selector: 'vdr-ab-right',
    template: `
        <ng-content></ng-content>
    `,
})
export class ActionBarRightComponent {
    @Input() grow = false;
}

@Component({
    selector: 'vdr-action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
    @ContentChild(ActionBarLeftComponent, { static: true }) left: ActionBarLeftComponent;
    @ContentChild(ActionBarRightComponent, { static: true }) right: ActionBarRightComponent;
}
