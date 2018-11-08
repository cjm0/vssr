const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2' // 使用 Node 风格导出模块
    },
    resolve: {
        alias: {
            'create-api': './create-api-server.js'
        }
    },
    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的 bundle 文件。
    externals: nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。例如，未处理 *.vue 原始文件，polyfill的依赖模块列入白名单
        whitelist: /\.css$/
    }),
    plugins: [
        // 组件内使用环境变量
        new webpack.DefinePlugin({ 
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        // 将服务端的整个输出构建为单个 JSON 文件,默认文件名为 `vue-ssr-server-bundle.json`
        new VueSSRServerPlugin()
    ]
})