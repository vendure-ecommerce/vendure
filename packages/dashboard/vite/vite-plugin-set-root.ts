import path from 'path';
import { Plugin, UserConfig } from 'vite';

export function setRootPlugin({ packageRoot }: { packageRoot: string }): Plugin {
    return {
        name: 'vendure:set-root-plugin',
        config: (config: UserConfig) => {
            config.root = packageRoot;
            config.resolve = {
                alias: {
                    '@': path.resolve(packageRoot, './src'),
                },
            };
            return config;
        },
    };
}
