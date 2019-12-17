import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    ExtensionHostComponent,
    ExtensionHostConfig,
    ModalService,
    SharedModule,
} from '@vendure/admin-ui/src';

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
    declarations: [TestComponent],
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: 'js-app',
                component: ExtensionHostComponent,
                data: {
                    extensionHostConfig: new ExtensionHostConfig({
                        extensionUrl: './assets/js-app/index.html',
                    }),
                },
            },
            {
                path: 'vue-app',
                component: ExtensionHostComponent,
                data: {
                    breadcrumb: [
                        {
                            label: 'Vue.js extension',
                            link: ['./'],
                        },
                    ],
                    extensionHostConfig: new ExtensionHostConfig({
                        extensionUrl: './assets/vue-app/index.html',
                        openInNewTab: true,
                    }),
                },
            },
        ]),
    ],
})
export class TestModule {}
