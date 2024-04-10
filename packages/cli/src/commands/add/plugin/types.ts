export interface GeneratePluginOptions {
    name: string;
    pluginDir: string;
}

export type NewPluginTemplateContext = GeneratePluginOptions & {
    pluginName: string;
    pluginInitOptionsName: string;
};
