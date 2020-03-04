import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'vdr-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
    @Input() userName = '';

    @Output() logOut = new EventEmitter<void>();
}
