import { EventEmitter } from '@angular/core';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';

@Directive({
    selector: '[vdrRelationCardPreview]',
})
export class RelationCardPreviewDirective {}
@Directive({
    selector: '[vdrRelationCardDetail]',
})
export class RelationCardDetailDirective {}

@Component({
    selector: 'vdr-relation-card',
    templateUrl: './relation-card.component.html',
    styleUrls: ['./relation-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationCardComponent {
    @Input() entity: any;
    @Input() placeholderIcon: string;
    @Input() selectLabel: string;
    @Input() readonly: boolean;
    @Input() removable = true;
    @Output() select = new EventEmitter();
    @Output() remove = new EventEmitter();
    @ContentChild(RelationCardPreviewDirective, { read: TemplateRef })
    previewTemplate: TemplateRef<any>;
    @ContentChild(RelationCardDetailDirective, { read: TemplateRef })
    detailTemplate: TemplateRef<any>;
}
