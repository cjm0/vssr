const path = require('path')
const config = require('../config.js') // 配置文件
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

// eslint检测
const createLintingRule = () => ({ 
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: /node_modules/,
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: true
    }
})

module.exports = {
    devtool: isProd ? false : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name]_[chunkhash:6].js'
    },
    resolve: {
        extensions: ['.css', '.js', '.vue', '.json'], // 使用的扩展名
        alias: {
            'public': resolve('../public'),
            'config': resolve('../config.js'),
            // 'pages': resolve('../src/pages'),
            // 'components': resolve('../src/components'),
            // 'assets': resolve('../src/assets'),
        }
    },
    module: {
        noParse: /es6-promise\.js$/,
        rules: [
            ...((config.base.useEslint && !isProd) ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    },
                    extractCSS: isProd
                }
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                // 重要：使用 vue-style-loader 替代 style-loader
                use: isProd 
                    ? ExtractTextPlugin.extract({
                        use: ['css-loader', 'postcss-loader'],
                        fallback: 'vue-style-loader'
                    }) 
                    : ['vue-style-loader', 'css-loader', 'postcss-loader',]
            },
            {
                test: /\.less$/,
                // 重要：使用 vue-style-loader 替代 style-loader
                use: isProd 
                    ? ExtractTextPlugin.extract({ // 从 JavaScript 中导入 CSS
                        use: ['css-loader', 'postcss-loader','less-loader'],
                        fallback: 'vue-style-loader'
                    }) 
                    : ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 4096,
                    name: '[name]_[hash:6].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash:6].[ext]',
                    limit: 4096,
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash:6].[ext]',
                    limit: 4096,
                }
            }
        ]
    },
    performance: { // 超过 200kb 提示
        maxEntrypointSize: 200000,
        hints: isProd ? 'warning' : false
    },
    plugins: isProd ? [
        new VueLoaderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
            filename: 'common_[chunkhash:6].css'
        })
    ] : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin()
    ]
}