import { MenuItem } from 'prosemirror-menu';
import { Node, NodeType } from 'prosemirror-model';
import { EditorState, NodeSelection, Plugin, Transaction } from 'prosemirror-state';
import {
    addColumnAfter,
    addColumnBefore,
    addRowAfter,
    addRowBefore,
    deleteColumn,
    deleteRow,
    deleteTable,
    mergeCells,
    splitCell,
    toggleHeaderColumn,
    toggleHeaderRow,
} from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';

import { ModalService } from '../../../../../providers/modal/modal.service';
import {
    ExternalImageAttrs,
    ExternalImageDialogComponent,
} from '../../external-image-dialog/external-image-dialog.component';
import { RawHtmlDialogComponent } from '../../raw-html-dialog/raw-html-dialog.component';
import { ContextMenuItem, ContextMenuService } from '../context-menu/context-menu.service';
import { canInsert, renderClarityIcon } from '../menu/menu-common';

export function insertImageItem(nodeType: NodeType, modalService: ModalService) {
    return new MenuItem({
        title: 'Insert image',
        label: 'Image',
        render: renderClarityIcon({ shape: 'image', label: 'Image' }),
        class: '',
        css: '',
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
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(result)!));
                    }
                    view.focus();
                });
        },
    });
}

export const imageContextMenuPlugin = (contextMenuService: ContextMenuService, modalService: ModalService) =>
    new Plugin({
        view: () => ({
            update: view => {
                if (!view.hasFocus()) {
                    return;
                }
                const { doc, selection } = view.state;
                let imageNode: Node | undefined;
                let imageNodePos = 0;
                doc.nodesBetween(selection.from, selection.to, (n, pos, parent) => {
                    if (n.type.name === 'image') {
                        imageNode = n;
                        imageNodePos = pos;
                        return false;
                    }
                });
                if (imageNode) {
                    const node = view.nodeDOM(imageNodePos);
                    if (node instanceof HTMLImageElement) {
                        contextMenuService.setContextMenu({
                            ref: selection,
                            title: 'Image',
                            iconShape: 'image',
                            element: node,
                            coords: view.coordsAtPos(imageNodePos),
                            items: [
                                {
                                    enabled: true,
                                    iconShape: 'image',
                                    label: 'Image properties',
                                    onClick: () => {
                                        contextMenuService.clearContextMenu();
                                        modalService
                                            .fromComponent(ExternalImageDialogComponent, {
                                                closable: true,
                                                locals: {
                                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                    existing: imageNode!.attrs as ExternalImageAttrs,
                                                },
                                            })
                                            .subscribe(result => {
                                                if (result) {
                                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                    view.dispatch(
                                                        view.state.tr.replaceSelectionWith(
                                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                            imageNode!.type.createAndFill(result)!,
                                                        ),
                                                    );
                                                }
                                                view.focus();
                                            });
                                    },
                                },
                            ],
                        });
                    }
                } else {
                    contextMenuService.clearContextMenu();
                }
            },
        }),
    });
