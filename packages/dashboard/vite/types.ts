export type Logger = {
    info: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
    error: (message: string) => void;
};

export type PluginInfo = {
    name: string;
    pluginPath: string;
    dashboardEntryPath: string | undefined;
    /** The original source path of the plugin, only set for local plugins that are compiled */
    sourcePluginPath?: string;
};

export type GetCompiledConfigPathFn = (params: {
    inputRootDir: string;
    outputPath: string;
    configFileName: string;
}) => string;

export type TransformTsConfigPathMappingsFn = (params: {
    phase: 'compiling' | 'loading';
    alias: string;
    patterns: string[];
}) => string[];

/**
 * @description
 * The PathAdapter interface allows customization of how paths are handled
 * when compiling the Vendure config and its imports.
 */
export interface PathAdapter {
    /**
     * @description
     * A function to determine the path to the compiled Vendure config file.
     */
    getCompiledConfigPath?: GetCompiledConfigPathFn;
    /**
     * If your project makes use of the TypeScript `paths` configuration, the compiler will
     * attempt to use these paths when compiling the Vendure config and its imports.
     */
    transformTsConfigPathMappings?: TransformTsConfigPathMappingsFn;
}
