export interface GeneratePluginOptions extends Record<string, any> {
    name: string;
    pluginDir: string;
}

export type NewPluginTemplateContext = GeneratePluginOptions & {
    pluginName: string;
    pluginInitOptionsName: string;
};
