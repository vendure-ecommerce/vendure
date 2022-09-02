import { buildMenuItems } from '@vendure/admin-ui/core';
import OrderedMap from 'orderedmap';
import { Dropdown, IconSpec, MenuElement, MenuItem } from 'prosemirror-menu';
import { NodeSpec, Schema, Node } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import {
    addColumnAfter,
    addColumnBefore,
    addRowAfter,
    addRowBefore,
    deleteColumn,
    deleteRow,
    deleteTable,
    isInTable,
    mergeCells,
    setCellAttr,
    splitCell,
    tableNodes,
    tableNodeTypes,
    toggleHeaderCell,
    toggleHeaderColumn,
    toggleHeaderRow,
} from 'prosemirror-tables';

export function getTableNodes() {
    return tableNodes({
        tableGroup: 'block',
        cellContent: 'block+',
        cellAttributes: {
            background: {
                default: null,
                getFromDOM(dom) {
                    return (dom as HTMLElement).style.backgroundColor || null;
                },
                setDOMAttr(value, attrs) {
                    if (value) attrs.style = (attrs.style || '') + `background-color: ${value};`;
                },
            },
        },
    });
}

export function getTableMenu(schema: Schema) {
    function item(
        label: string,
        cmd: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean,
        iconShape?: string,
    ) {
        return new MenuItem({
            label,
            select: cmd,
            run: cmd,
            render: iconShape
                ? view => {
                      const icon = document.createElement('clr-icon');
                      icon.setAttribute('shape', iconShape);
                      icon.setAttribute('size', '16');
                      const wrapperEl = document.createElement('span');
                      wrapperEl.classList.add('menu-item-with-icon');
                      const labelEl = document.createElement('span');
                      labelEl.textContent = label;
                      wrapperEl.append(icon, labelEl);
                      return wrapperEl;
                  }
                : undefined,
        });
    }
    function separator(): MenuElement {
        return new MenuItem({
            select: state => isInTable(state),
            run: state => {},
            render: view => {
                const el = document.createElement('div');
                el.classList.add('menu-separator');
                return el;
            },
        });
    }

    return [
        item('Insert column before', addColumnBefore),
        item('Insert column after', addColumnAfter),
        item('Insert row before', addRowBefore),
        item('Insert row after', addRowAfter),
        item('Merge cells', mergeCells),
        item('Split cell', splitCell),
        separator(),
        item('Toggle header column', toggleHeaderColumn),
        item('Toggle header row', toggleHeaderRow),
        item('Toggle header cells', toggleHeaderCell),
        separator(),
        item('Delete column', deleteColumn),
        item('Delete row', deleteRow),
        item('Delete table', deleteTable),
    ];
}

function createTable(state, rowsCount, colsCount, withHeaderRow, cellContent) {
    const types = tableNodeTypes(state.schema);
    const headerCells: Node[] = [];
    const cells: Node[] = [];
    const createCell = (cellType, _cellContent) =>
        _cellContent ? cellType.createChecked(null, _cellContent) : cellType.createAndFill();

    for (let index = 0; index < colsCount; index += 1) {
        const cell = createCell(types.cell, cellContent);

        if (cell) {
            cells.push(cell);
        }

        if (withHeaderRow) {
            const headerCell = createCell(types.header_cell, cellContent);

            if (headerCell) {
                headerCells.push(headerCell);
            }
        }
    }

    const rows: Node[] = [];

    for (let index = 0; index < rowsCount; index += 1) {
        rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
    }

    return types.table.createChecked(null, rows);
}

export function addTable(state, dispatch, { rowsCount, colsCount, withHeaderRow, cellContent }) {
    const offset = state.tr.selection.anchor + 1;

    const nodes = createTable(state, rowsCount, colsCount, withHeaderRow, cellContent);
    const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
    const resolvedPos = tr.doc.resolve(offset);

    tr.setSelection(TextSelection.near(resolvedPos));

    dispatch(tr);
}

// add table to a new paragraph
export function addTableToEnd(state, dispatch, { rowsCount, colsCount, withHeaderRow, cellContent }) {
    let tr = state.tr;

    // get block end position
    const end = tr.selection.$head.end(1); // param 1 is node deep
    const resolvedEnd = tr.doc.resolve(end);

    // move cursor to the end, then insert table
    const nodes = createTable(state, rowsCount, colsCount, withHeaderRow, cellContent);
    tr.setSelection(TextSelection.near(resolvedEnd));
    tr = tr.replaceSelectionWith(nodes).scrollIntoView();

    // move cursor into table
    const offset = end + 1;
    const resolvedPos = tr.doc.resolve(offset);
    tr.setSelection(TextSelection.near(resolvedPos));

    dispatch(tr);
}
