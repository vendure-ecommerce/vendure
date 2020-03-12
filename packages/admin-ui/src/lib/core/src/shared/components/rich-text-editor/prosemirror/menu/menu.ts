import { toggleMark } from 'prosemirror-commands';
import {
    blockTypeItem,
    Dropdown,
    DropdownSubmenu,
    icons,
    joinUpItem,
    liftItem,
    MenuItem,
    redoItem,
    selectParentNodeItem,
    undoItem,
    wrapItem,
} from 'prosemirror-menu';
import { MarkType, NodeType, Schema } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';
import { EditorState } from 'prosemirror-state';

import { ModalService } from '../../../../../providers/modal/modal.service';

import { insertImageItem } from './images';
import { linkItem } from './links';
import { canInsert, markActive } from './menu-common';

// Helpers to create specific types of items

function cmdItem(cmd: (...args: any[]) => void, options: Record<string, any>) {
    const passedOptions = {
        label: options.title,
        run: cmd,
    };
    // tslint:disable-next-line:forin
    for (const prop in options) {
        passedOptions[prop] = options[prop];
    }
    if ((!options.enable || options.enable === true) && !options.select) {
        passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state);
    }

    return new MenuItem(passedOptions as any);
}

function markItem(markType, options) {
    const passedOptions = {
        active(state) {
            return markActive(state, markType);
        },
        enable: true,
    };
    // tslint:disable-next-line:forin
    for (const prop in options) {
        passedOptions[prop] = options[prop];
    }
    return cmdItem(toggleMark(markType), passedOptions);
}

function wrapListItem(nodeType, options) {
    return cmdItem(wrapInList(nodeType, options.attrs), options);
}

// :: (Schema) → Object
// Given a schema, look for default mark and node types in it and
// return an object with relevant menu items relating to those marks:
//
// **`toggleStrong`**`: MenuItem`
//   : A menu item to toggle the [strong mark](#schema-basic.StrongMark).
//
// **`toggleEm`**`: MenuItem`
//   : A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
//
// **`toggleCode`**`: MenuItem`
//   : A menu item to toggle the [code font mark](#schema-basic.CodeMark).
//
// **`toggleLink`**`: MenuItem`
//   : A menu item to toggle the [link mark](#schema-basic.LinkMark).
//
// **`insertImage`**`: MenuItem`
//   : A menu item to insert an [image](#schema-basic.Image).
//
// **`wrapBulletList`**`: MenuItem`
//   : A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
//
// **`wrapOrderedList`**`: MenuItem`
//   : A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
//
// **`wrapBlockQuote`**`: MenuItem`
//   : A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
//
// **`makeParagraph`**`: MenuItem`
//   : A menu item to set the current textblock to be a normal
//     [paragraph](#schema-basic.Paragraph).
//
// **`makeCodeBlock`**`: MenuItem`
//   : A menu item to set the current textblock to be a
//     [code block](#schema-basic.CodeBlock).
//
// **`makeHead[N]`**`: MenuItem`
//   : Where _N_ is 1 to 6. Menu items to set the current textblock to
//     be a [heading](#schema-basic.Heading) of level _N_.
//
// **`insertHorizontalRule`**`: MenuItem`
//   : A menu item to insert a horizontal rule.
//
// The return value also contains some prefabricated menu elements and
// menus, that you can use instead of composing your own menu from
// scratch:
//
// **`insertMenu`**`: Dropdown`
//   : A dropdown containing the `insertImage` and
//     `insertHorizontalRule` items.
//
// **`typeMenu`**`: Dropdown`
//   : A dropdown containing the items for making the current
//     textblock a paragraph, code block, or heading.
//
// **`fullMenu`**`: [[MenuElement]]`
//   : An array of arrays of menu elements for use as the full menu
//     for, for example the [menu bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
export function buildMenuItems(schema: Schema, modalService: ModalService) {
    const r: Record<string, any> = {};
    let type: MarkType | NodeType;
    // tslint:disable:no-conditional-assignment
    if ((type = schema.marks.strong)) {
        r.toggleStrong = markItem(type, { title: 'Toggle strong style', icon: icons.strong });
    }
    if ((type = schema.marks.em)) {
        r.toggleEm = markItem(type, { title: 'Toggle emphasis', icon: icons.em });
    }
    if ((type = schema.marks.code)) {
        r.toggleCode = markItem(type, { title: 'Toggle code font', icon: icons.code });
    }
    if ((type = schema.marks.link)) {
        r.toggleLink = linkItem(type, modalService);
    }

    if ((type = schema.nodes.image)) {
        r.insertImage = insertImageItem(type, modalService);
    }
    if ((type = schema.nodes.bullet_list)) {
        r.wrapBulletList = wrapListItem(type, {
            title: 'Wrap in bullet list',
            icon: icons.bulletList,
        });
    }
    if ((type = schema.nodes.ordered_list)) {
        r.wrapOrderedList = wrapListItem(type, {
            title: 'Wrap in ordered list',
            icon: icons.orderedList,
        });
    }
    if ((type = schema.nodes.blockquote)) {
        r.wrapBlockQuote = wrapItem(type, {
            title: 'Wrap in block quote',
            icon: icons.blockquote,
        });
    }
    if ((type = schema.nodes.paragraph)) {
        r.makeParagraph = blockTypeItem(type, {
            title: 'Change to paragraph',
            label: 'Plain',
        });
    }
    if ((type = schema.nodes.code_block)) {
        r.makeCodeBlock = blockTypeItem(type, {
            title: 'Change to code block',
            label: 'Code',
        });
    }
    if ((type = schema.nodes.heading)) {
        for (let i = 1; i <= 10; i++) {
            r['makeHead' + i] = blockTypeItem(type, {
                title: 'Change to heading ' + i,
                label: 'Level ' + i,
                attrs: { level: i },
            });
        }
    }
    if ((type = schema.nodes.horizontal_rule)) {
        const hr = type;
        r.insertHorizontalRule = new MenuItem({
            title: 'Insert horizontal rule',
            label: 'Horizontal rule',
            class: '',
            css: '',
            execEvent: 'mousedown',
            enable(state) {
                return canInsert(state, hr);
            },
            run(state: EditorState, dispatch) {
                dispatch(state.tr.replaceSelectionWith(hr.create()));
            },
        });
    }

    const cut = <T>(arr: T[]): T[] => arr.filter(x => x);
    r.insertMenu = new Dropdown(cut([r.insertImage, r.insertHorizontalRule]), { label: 'Insert' });
    r.typeMenu = new Dropdown(
        cut([
            r.makeParagraph,
            r.makeCodeBlock,
            r.makeHead1 &&
                new DropdownSubmenu(
                    cut([r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6]),
                    { label: 'Heading' },
                ),
        ]),
        { label: 'Type...' },
    );

    const inlineMenu = cut([r.toggleStrong, r.toggleEm, r.toggleLink]);
    r.inlineMenu = [inlineMenu];
    r.blockMenu = [
        cut([
            r.wrapBulletList,
            r.wrapOrderedList,
            r.wrapBlockQuote,
            joinUpItem,
            liftItem,
            selectParentNodeItem,
        ]),
    ];
    r.fullMenu = [inlineMenu].concat([[r.insertMenu, r.typeMenu]], [[undoItem, redoItem]], r.blockMenu);

    return r;
}
