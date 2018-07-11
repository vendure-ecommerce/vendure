import {
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Type,
    ViewContainerRef,
} from '@angular/core';

/**
 * A helper component used to embed a component instance into the {@link ModalDialogComponent}
 */
@Component({
    selector: 'vdr-dialog-component-outlet',
    template: ``,
})
export class DialogComponentOutletComponent implements OnInit {
    @Input() component: Type<any>;
    @Output() create = new EventEmitter<any>();

    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
    ) {}

    ngOnInit() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        const componentRef = this.viewContainerRef.createComponent(factory);
        this.create.emit(componentRef.instance);
    }
}
