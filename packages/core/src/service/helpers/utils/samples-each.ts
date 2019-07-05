/**
 * Returns true if and only if exactly one item from each
 * of the "groups" arrays appears in the "sample" array.
 */
export function samplesEach<T>(sample: T[], groups: T[][]): boolean {
    if (sample.length !== groups.length) {
        return false;
    }
    const groupMap = groups.reduce((map, group) => {
        map.set(group, false);
        return map;
    }, new Map<T[], boolean>());
    for (const item of sample) {
        const unseenGroups = Array.from(groupMap.entries()).filter(([group, seen]) => !seen).map(e => e[0]);
        for (const group of unseenGroups) {
            if (group.includes(item)) {
                groupMap.set(group, true);
            }
        }
    }
    return Array.from(groupMap.values()).every(v => !!v);
}
