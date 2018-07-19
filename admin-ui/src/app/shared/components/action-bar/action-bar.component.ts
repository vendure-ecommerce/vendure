import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'vdr-action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {}

@Component({
    selector: 'vdr-ab-left',
    template: `<ng-content></ng-content>`,
})
export class ActionBarLeftComponent {}

@Component({
    selector: 'vdr-ab-right',
    template: `<ng-content></ng-content>`,
})
export class ActionBarRightComponent {}
