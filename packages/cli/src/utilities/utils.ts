/**
 * Since the AST manipulation is blocking, prompts will not get a
 * chance to be displayed unless we give a small async pause.
 */
export async function pauseForPromptDisplay() {
    await new Promise(resolve => setTimeout(resolve, 100));
}

export function isRunningInTsNode(): boolean {
    // @ts-ignore
    return process[Symbol.for('ts-node.register.instance')] != null;
}
