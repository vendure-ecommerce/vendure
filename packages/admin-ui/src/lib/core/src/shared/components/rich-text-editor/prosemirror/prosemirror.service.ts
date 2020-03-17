import { Injectable } from '@angular/core';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { menuBar } from 'prosemirror-menu';
import { DOMParser, DOMSerializer, Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { ModalService } from '../../../../providers/modal/modal.service';

import { buildInputRules } from './inputrules';
import { buildKeymap } from './keymap';
import { buildMenuItems } from './menu/menu';
import { linkSelectPlugin } from './plugins/link-select-plugin';
import { SetupOptions } from './types';

export interface CreateEditorViewOptions {
    onTextInput: (content: string) => void;
    element: HTMLElement;
    isEditable: () => boolean;
}

@Injectable()
export class ProsemirrorService {
    editorView: EditorView;

    // Mix the nodes from prosemirror-schema-list into the basic schema to
    // create a schema with list support.
    private mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
        marks: schema.spec.marks,
    });
    private enabled = true;

    constructor(private modalService: ModalService) {}

    createEditorView(options: CreateEditorViewOptions) {
        this.editorView = new EditorView<Schema>(options.element, {
            state: this.getStateFromText(''),
            dispatchTransaction: tr => {
                if (!this.enabled) {
                    return;
                }
                this.editorView.updateState(this.editorView.state.apply(tr));
                if (tr.docChanged) {
                    const content = this.getTextFromState(this.editorView.state);
                    options.onTextInput(content);
                }
            },
            editable: () => options.isEditable(),
        });
    }

    update(text: string) {
        if (this.editorView) {
            const state = this.getStateFromText(text);
            this.editorView.updateState(state);
        }
    }

    destroy() {
        if (this.editorView) {
            this.editorView.destroy();
        }
    }

    setEnabled(enabled: boolean) {
        if (this.editorView) {
            this.enabled = enabled;
        }
    }

    private getStateFromText(text: string): EditorState {
        const div = document.createElement('div');
        div.innerHTML = text;
        return EditorState.create({
            doc: DOMParser.fromSchema(this.mySchema).parse(div),
            plugins: this.configurePlugins({ schema: this.mySchema, floatingMenu: false }),
        });
    }

    private getTextFromState(state: EditorState): string {
        const div = document.createElement('div');
        const fragment = DOMSerializer.fromSchema(this.mySchema).serializeFragment(state.doc.content);

        div.appendChild(fragment);

        return div.innerHTML;
    }

    private configurePlugins(options: SetupOptions) {
        const plugins = [
            buildInputRules(options.schema),
            keymap(buildKeymap(options.schema, options.mapKeys)),
            keymap(baseKeymap),
            dropCursor(),
            gapCursor(),
            linkSelectPlugin,
        ];
        if (options.menuBar !== false) {
            plugins.push(
                menuBar({
                    floating: options.floatingMenu !== false,
                    content:
                        options.menuContent || buildMenuItems(options.schema, this.modalService).fullMenu,
                }),
            );
        }
        if (options.history !== false) {
            plugins.push(history());
        }

        return plugins.concat(
            new Plugin({
                props: {
                    attributes: { class: 'vdr-prosemirror' },
                },
            }),
        );
    }
}
