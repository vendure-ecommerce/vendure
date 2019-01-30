import { ClarityIcons } from '@clr/icons';
import { ClrShapeLibrary } from '@clr/icons/shapes/essential-shapes';
import { ClrShapeCluster, ClrShapeTerminal } from '@clr/icons/shapes/technology-shapes';

export function initIcons() {
    ClarityIcons.add({
        library: ClrShapeLibrary,
        cluster: ClrShapeCluster,
        terminal: ClrShapeTerminal,
    });
}
