'use strict';

require('module').Module._initPaths();

const path = require('path');

const AssetsPlugin = require('assets-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const _ = require('lodash');

const {
    NODE_ENV,
    NODE_PATH: NODE_PATH_CLI = './',
    PROJECT_ROOT: PROJECT_ROOT_CLI = './',
} = process.env;
const IS_DEVELOPMENT = NODE_ENV !== 'production';

const PUBLIC_PATH = '/';

const NODE_PATH = path.resolve(NODE_PATH_CLI);
const PROJECT_ROOT = path.resolve(PROJECT_ROOT_CLI);

const OUTPUT_PATH = path.join(NODE_PATH, 'build_client');
const APP_ROOT = path.join(PROJECT_ROOT, 'client');

const APP_ENTRY_PATH = './index.tsx';

function buildAssetName(ext, isBundle) {
    if (isBundle) {
        return IS_DEVELOPMENT
            ? `[name].bundle.${ext}`
            : `[id].bundle.[chunkhash].${ext}`;
    }

    return IS_DEVELOPMENT
        ? `[name].chunk.${ext}`
        : `[id].chunk.[chunkhash].${ext}`;
}

function buildAssetNameWithPath() {
    return IS_DEVELOPMENT
        ? '[path][name].[ext]'
        : '[hash].[ext]';
}

module.exports = {
    performance: {
        maxEntrypointSize: Math.pow(10, 6),
        maxAssetSize: Math.pow(10, 6),
    },
    stats: {
        children: false,
    },
    context: APP_ROOT,
    mode: NODE_ENV,
    entry: {
        app: APP_ENTRY_PATH,
    },
    watch: IS_DEVELOPMENT,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 500,
        ignored: [
            '.awcache',
            /build_/,
            'logs',
            'node_modules',
        ],
    },
    output: {
        filename: buildAssetName('js', true),
        chunkFilename: buildAssetName('js', false),
        path: OUTPUT_PATH,
        publicPath: PUBLIC_PATH,
        globalObject: 'this',
    },
    resolve: {
        alias: {
            client: path.join(PROJECT_ROOT, 'client'),
            common: path.join(PROJECT_ROOT, 'common'),
        },
        extensions: [
            '.ts',
            '.js',
            '.tsx',
            '.jsx',
            '.scss',
            '.css',
        ],
    },
    devtool: 'source-map',
    optimization: {
        noEmitOnErrors: true,
    },
    plugins: [
        new AssetsPlugin({
            filename: 'assets.json',
            prettyPrint: true,
            path: OUTPUT_PATH,
            fullPath: false,
            update: true,
            processOutput(assets) {
                Object.keys(assets).forEach(key => {
                    assets[key] = _.mapValues(assets[key], value => `${PUBLIC_PATH}${_.trim(value, PUBLIC_PATH)}`);
                });

                return JSON.stringify(assets, null, '  ');
            },
        }),
        new MiniCssExtractPlugin({
            filename: buildAssetName('css', true),
            allChunks: true,
            chunkFilename: buildAssetName('css', false),
        }),
        new ExtractCssChunks(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/),
    ].filter(Boolean),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useCache: true,
                            reportFiles: [
                                '(client|common)/**/*.{ts,tsx}',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '// @import *.scss',
                            replace: `const styles = require.context('.', true, /\\.scss$/);
                            styles.keys().forEach(styles);`,
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/,
                use: [
                    IS_DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            name: buildAssetNameWithPath(),
                            importLoaders: 1,
                            sourceMap: true,
                            minimize: IS_DEVELOPMENT ? false : {
                                autoprefixer: false,
                                core: true,
                                convertValues: true,
                                discardComments: true,
                                discardEmpty: true,
                                mergeRules: true,
                                minifyGradients: true,
                                minifySelectors: true,
                                normalizeString: true,
                                normalizeUrl: true,
                                reduceBackgroundRepeat: true,
                                reducePositions: true,
                                reduceTransforms: true,
                                svgo: false,
                                styleCache: true,
                                reduceTimingFunctions: true,
                                reduceInitial: true,
                                orderedValues: true,
                                normalizeCharset: true,
                                minifyParams: true,
                                minifyFontValues: true,
                                mergeLonghand: true,
                                functionOptimiser: true,
                                filterOptimiser: true,
                                discardOverridden: true,
                                discardDuplicates: true,
                                colormin: true,
                                zindex: false,
                            },
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
};
