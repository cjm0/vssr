const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(base, {
    entry: {
        app: './src/entry-client.js'
    },
    resolve: {
        alias: { // 设置别名
            'create-api': './create-api-client.js'
        }
    },
    plugins: [
        // 组件内使用环境变量
        new webpack.DefinePlugin({ 
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // 将依赖模块提取到 vendor chunk 以获得更好的缓存
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                // 一个模块被提取到 vendor chunk 时，如果它在 node_modules 中并且 request 不是一个 CSS
                return (
                    /node_modules/.test(module.context) && !/\.css$/.test(module.request)
                )
            }
        }),
        // 提取 webpack 运行时和 manifest
        new webpack.optimize.CommonsChunkPlugin({ 
            name: 'manifest'
        }),
        // 将客户端的整个输出构建为单个 JSON 文件,默认文件名为 `vue-ssr-client-manifest.json`
        new VueSSRClientPlugin()
    ]
})

// pwa 缓存插件
if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new SWPrecachePlugin({
            cacheId: 'vue-ssr-1.9',
            filename: 'service-worker.js', 
            minify: true, // 压缩，默认false
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
            mergeStaticsConfig: true,
            stripPrefixMulti: {
                [path.join(__dirname, '../public')]: '/public'
            },
            staticFileGlobs: [
                '/',
                path.resolve(__dirname, '../public/*.*'),
            ],
        })
    )
}

module.exports = config


