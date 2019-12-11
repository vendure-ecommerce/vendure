// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default commandLineArgs => {
    const isProd = commandLineArgs.configProduction === true;
    return {
        input: 'src/index.ts',
        output: {
            dir: 'lib',
            format: 'umd',
            name: 'VendureUiDevkit',
        },
        plugins: [resolve(), typescript(), ...(isProd ? [terser({
            output: {
                comments: false,
            }
        })] : [])],
    };
};
