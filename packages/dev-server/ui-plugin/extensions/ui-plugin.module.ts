import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService, SharedModule } from '@vendure/admin-ui/src';

@Component({
    selector: 'plugin-test-component',
    template: `
        <p>Test component works!!!</p>
        <button class="btn btn-primary" (click)="handleClick()">Click me!</button>
    `,
})
export class TestComponent {
    constructor(private modalService: ModalService) {}

    handleClick() {
        this.modalService
            .dialog({
                title: 'Did it work?',
                buttons: [{ label: 'Yes!!!!', returnValue: true, type: 'primary' }],
            })
            .subscribe(val => {
                // tslint:disable-next-line:no-console
                console.log(val);
            });
    }
}

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: 'test',
                component: TestComponent,
            },
        ]),
    ],
    declarations: [TestComponent],
})
export class TestModule {}
