export type HasParent = { id: string; parent?: { id: string } | null };
export type TreeNode<T extends HasParent> = T & { children: Array<TreeNode<T>>; expanded: boolean };
export type RootNode<T extends HasParent> = { id?: string; children: Array<TreeNode<T>> };

/**
 * Builds a tree from an array of nodes which have a parent.
 * Based on https://stackoverflow.com/a/31247960/772859, modified to preserve ordering.
 */
export function arrayToTree<T extends HasParent>(nodes: T[]): RootNode<T> {
    const topLevelNodes: Array<TreeNode<T>> = [];
    const mappedArr: { [id: string]: TreeNode<T> } = {};

    // First map the nodes of the array to an object -> create a hash table.
    for (const node of nodes) {
        mappedArr[node.id] = { ...(node as any), children: [] };
    }

    for (const id of nodes.map(n => n.id)) {
        if (mappedArr.hasOwnProperty(id)) {
            const mappedElem = mappedArr[id];
            mappedElem.expanded = false;
            const parent = mappedElem.parent;
            if (!parent) {
                continue;
            }
            // If the element is not at the root level, add it to its parent array of children.
            const parentIsRoot = !mappedArr[parent.id];
            if (!parentIsRoot) {
                if (mappedArr[parent.id]) {
                    mappedArr[parent.id].children.push(mappedElem);
                } else {
                    mappedArr[parent.id] = { children: [mappedElem] } as any;
                }
            } else {
                topLevelNodes.push(mappedElem);
            }
        }
    }
    // tslint:disable-next-line:no-non-null-assertion
    const rootId = topLevelNodes.length ? topLevelNodes[0].parent!.id : undefined;
    return { id: rootId, children: topLevelNodes };
}
