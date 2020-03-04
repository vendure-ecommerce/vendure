import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export function markActive(state, type) {
    const { from, $from, to, empty } = state.selection;
    if (empty) {
        return type.isInSet(state.storedMarks || $from.marks());
    } else {
        return state.doc.rangeHasMark(from, to, type);
    }
}

export function canInsert(state: EditorState, nodeType: NodeType): boolean {
    const $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        const index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) {
            return true;
        }
    }
    return false;
}
