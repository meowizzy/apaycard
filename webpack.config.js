const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const localesByAppTypes = require("./src/localization/locales");

const getLocalesByAppType = (appType) => ({
    ru: {
        name: "index",
        data: localesByAppTypes[appType]["ru"]
    },
    uz: {
        name: "uz",
        data: localesByAppTypes[appType]["uz"]
    },
    cuz: {
        name: "cuz",
        data: localesByAppTypes[appType]["cuz"]
    }
});

module.exports = (env) => {
    const mode = env.mode || "development";
    const isEnvDev = env.isDev === "true";
    const isDev = mode === "development";
    const isProd = !isDev;
    const APP_TYPE = env.appType || "CARD_ATTACHMENT";
    const target = isDev ? "web" : "browserslist";
    const devtool = isDev ? "source-map" : undefined;

    const appTypeEntries = {
        "PAYMENT": {
            styles: path.resolve(__dirname, "src", "./app-payment/styles/main.scss")
        },
        "CARD_ATTACHMENT": {
            styles: path.resolve(__dirname, "src", "./app-card-attachment/styles/main.scss")
        },
    };

    return {
        mode,
        target,
        devtool,
        entry: [
            "@babel/polyfill",
            path.resolve(__dirname, "src", "./js/index.js"),
            appTypeEntries[APP_TYPE].styles,
            path.resolve(__dirname, "src", "./styles/main.scss")
        ],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: `js/bundle.min.js?ver=${Date.now()}`,
            clean: !isDev && {
                keep: /textolite\//
            },
            assetModuleFilename: "assets/[name][ext]",
        },
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    loader: "handlebars-loader",
                    options: {
                        inlineRequires: '\/images/*/\/',
                        helperDirs: [path.resolve(__dirname, "src/handlebars-helpers")]
                    },
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader"
                },
                {
                    test: /\.(scss|sass|less|css)$/,
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        ["postcss-preset-env"],
                                    ],
                                },
                            }
                        },
                        "sass-loader",
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][ext]"
                    }
                },
                {
                    test: /\.(jpe?g|png|webp|gif|svg)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(?:js|mjs|cjs)$/,
                    exclude: "/(node_modules|bower_components)/",
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: "defaults" }]
                            ],
                        },
                    }
                }
            ]
        },
        plugins: [
            ...Object.entries(getLocalesByAppType(APP_TYPE)).map(([key, tpl]) => {
                return new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, "src", `index.hbs`),
                    filename: `${tpl.name}.html`,
                    inject: "body",
                    chunks: ["main"],
                    minify: false,
                    templateParameters: Object.assign(tpl.data,{
                        APP_TYPE,
                        title: `A-Pay | ${tpl.data.title}`,
                        lang: key
                    })
                })
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: "./src/images",  to: "./assets" },
                ]
            }),
            isProd && new MiniCssExtractPlugin({
                filename: `css/bundle.css?ver=${Date.now()}`,
            }),
            new webpack.DefinePlugin({
                __IS_DEV__: JSON.stringify(isEnvDev),
                __MODE__: JSON.stringify(mode),
                __APP_TYPE__: JSON.stringify(APP_TYPE)
            }),
        ],
        devServer: isDev ? {
            static: {
                directory: path.join(__dirname, "./dist"),
            },
            // proxy: {
            //     "/api": {
            //         target: "https://api-dev.a-pay.uz/api",
            //         secure: false,
            //         changeOrigin: true,
            //     },
            // },
            port: 3001,
            open: true,
            historyApiFallback: true,
            hot: true,
            liveReload: true
        } : undefined,
    };
};