const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const uzLocales = require("./src/localization/uz.json");
const ruLocales = require("./src/localization/ru.json");
const cuzLocales = require("./src/localization/cuz.json");

const appTypes = {
    CARD_ATTACHMENT: {
        entry: path.resolve(__dirname, "src", "./app-card-attachment/index.js"),
        template: path.resolve(__dirname, "src", "./app-card-attachment/index.hbs"),
        output: "build-card-attachment"
    },
    PAYMENT: {
        entry: path.resolve(__dirname, "src", "./app-payment/index.js"),
        template: path.resolve(__dirname, "src", "./app-payment/index.hbs"),
        output: "build-payment"
    }
};

const locales = {
    ru: {
        name: "index",
        data: ruLocales,
    },
    uz: {
        name: "uz",
        data: uzLocales,
    },
    cuz: {
        name: "cuz",
        data: cuzLocales
    }
};

module.exports = (env) => {
    const mode = env.mode || "development";
    const isDev = mode === "development";
    const isProd = !isDev;
    const appType = env.appType || appTypes.CARD_ATTACHMENT;
    const target = isDev ? "web" : "browserslist";
    const devtool = isDev ? "source-map" : undefined;

    return {
        mode,
        target,
        devtool,
        entry: [
            "@babel/polyfill",
            path.resolve(__dirname, "src", "./js/index.js"),
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
            ...Object.entries(locales).map(([key, tpl]) => {
                return new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, "src", `index.hbs`),
                    filename: `${tpl.name}.html`,
                    inject: "body",
                    chunks: ["main"],
                    minify: false,
                    templateParameters: Object.assign(tpl.data,{
                        title: tpl.data.title,
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
                __IS_DEV__: JSON.stringify(isDev),
                __MODE__: JSON.stringify(mode)
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
            port: 3002,
            open: true,
            historyApiFallback: true,
            hot: true,
            liveReload: true
        } : undefined,
    };
};