import { MenuItem } from 'prosemirror-menu';
import { NodeType } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { ModalService } from '../../../../../providers/modal/modal.service';
import {
    ExternalImageAttrs,
    ExternalImageDialogComponent,
} from '../../external-image-dialog/external-image-dialog.component';

import { canInsert } from './menu-common';

export function insertImageItem(nodeType: NodeType, modalService: ModalService) {
    return new MenuItem({
        title: 'Insert image',
        label: 'Image',
        class: '',
        css: '',
        execEvent: 'mousedown',
        enable(state: EditorState) {
            return canInsert(state, nodeType);
        },
        run(state: EditorState, _, view: EditorView) {
            let attrs: ExternalImageAttrs | undefined;
            if (state.selection instanceof NodeSelection && state.selection.node.type === nodeType) {
                attrs = state.selection.node.attrs as ExternalImageAttrs;
            }
            modalService
                .fromComponent(ExternalImageDialogComponent, {
                    closable: true,
                    locals: {
                        existing: attrs,
                    },
                })
                .subscribe(result => {
                    if (result) {
                        // tslint:disable-next-line:no-non-null-assertion
                        view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(result)!));
                    }
                    view.focus();
                });
        },
    });
}
