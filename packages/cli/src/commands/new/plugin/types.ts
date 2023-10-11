export interface GeneratePluginOptions {
    name: string;
    withCustomEntity: boolean;
    withApiExtensions: boolean;
    withAdminUi: boolean;
    customEntityName: string;
}

export type TemplateContext = GeneratePluginOptions & {
    pluginName: string;
    pluginInitOptionsName: string;
    service: {
        instanceName: string;
        className: string;
        fileName: string;
    };
    entity: {
        instanceName: string;
        className: string;
        fileName: string;
    };
};
