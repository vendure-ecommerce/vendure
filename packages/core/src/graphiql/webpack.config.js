const path = require('node:path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const webpack = require('webpack');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: path.resolve(__dirname, 'index.mjs'),
    output: {
        path: path.resolve(__dirname, 'output'),
        clean: true,
        publicPath: '',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css', '.mjs'],
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/index.html'),
            inject: 'body',
        }),
        new HtmlInlineScriptPlugin(),
    ],
};
