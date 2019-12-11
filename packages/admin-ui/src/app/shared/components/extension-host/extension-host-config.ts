export interface ExtensionHostOptions {
    extensionUrl: string;
}

export class ExtensionHostConfig {
    public extensionUrl: string;
    constructor(options: ExtensionHostOptions) {
        this.extensionUrl = options.extensionUrl;
    }
}
