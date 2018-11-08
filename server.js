const fs = require('fs') // 文件操作插件
const path = require('path') // 路径操作插件
const config = require('./config.js') // 配置文件
const LRU = require('lru-cache') // 缓存插件，尽量保留访问次数最多的数据
const express = require('express') // node express 框架
const favicon = require('serve-favicon') // 中间件,用于请求网站的icon
const compression = require('compression') // 中间件,用于压缩和处理静态内容
const microcache = require('route-cache') 
const proxy = require('http-proxy-middleware') // 中间件,代理跨域
const isProd = process.env.NODE_ENV === 'production'
const app = express()


const {createBundleRenderer} = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file) 

/*
    https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    vue-server-renderer 提供一个名为 createBundleRenderer 的api
    提供内置的source map支持 热重载 代码分割 CSS注入
*/
function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: LRU({ // 组件缓存15分钟
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),
        runInNewContext: false // 推荐
    }))
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) { // 生产环境使用本地打包文件来渲染
    const template = fs.readFileSync(templatePath, 'utf-8') // 页面模板
    const bundle = require('./dist/vue-ssr-server-bundle.json') // 打包好的服务端构建
    const clientManifest = require('./dist/vue-ssr-client-manifest.json') // 打包好的客户端构建 

    renderer = createRenderer(bundle, {
        template, 
        clientManifest 
    })
} else { // 开发环境使用webpack热更新服务
    readyPromise = require('./build/setup-dev-server')(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options)
        }
    )
}

// express 中间件处理
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0 // 一个月
})

app.use(compression({threshold: 0}))
app.use(favicon(`${config.base.favicon}`))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

// 代理跨域配置 https://www.jianshu.com/p/a248b146c55a
const proxyTable = config.server.proxy
Object.keys(proxyTable).forEach(key => {
    app.use(key, proxy(proxyTable[key]))
})

function render(req, res) {  // 此处req能够获取到全部请求信息
    res.setHeader("Content-Type", "text/html")
    res.setHeader("Server", serverInfo)

    const s = Date.now()
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('Vue ssr 404 | Page Not Found')
        } else {
            res.status(500).send('Vue ssr 500 | Internal Server Error')
            console.error(`Vue ssr error during render : ${req.url}`)
            console.error(err.stack)
        }
    }
    const context = { // 传入一个"渲染上下文对象"，作为 renderToString 函数的第二个参数，来提供插值数据
        title: config.base.title, 
        keywords: config.base.keywords,
        description: config.base.description,
        version: config.base.version,
        url: req.url,
        cookies: req.headers.cookie, // 获取cookie注入全局上下文
    }
    
    renderer.renderToString(context, (err, html) => { // 将 Vue 实例渲染为 HTML
        if (err) {
            return handleError(err)
        }
        res.send(html)
        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    })
}

app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res))
})

const port = config.server.port || process.env.PORT
const host = config.server.host

if (isProd) { 
    app.listen(port, () => {
        console.log(`Vue ssr server started at ${port}`)
    })
} else {
    app.listen(port, host, () => {
        console.log(`Vue ssr server started at ${host}:${port}`)
    })
}

