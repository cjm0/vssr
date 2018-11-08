const os = require('os')
const getIp = () => { // 获取本地ip
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


module.exports = {
    base: {
        useEslint: false,
        favicon: './public/logo-48.png',
        version: 1.1 || Date.now(), // 用来给外部引入并且会变化的资源打标记，防止缓存
        title: 'Vue SSR',
        keywords: "vue-server-renderer 和 vue 必须匹配版本",
        description: "Vue SSR 服务端脚手架,更好的SEO,更快的内容到达时间",
    },
    ajax: {
        client: {
            baseURL: `http://${getIp()}:8083`,
        },
        // 开发环境后端预请求地址前面要加本地的域名否则默认是 127.0.0.1:80
        server: {
            baseURL: `http://${getIp()}:8083`,
        }
    },
    server: { // 跨域处理
        host: getIp(),
        port: 8083,
        proxy: {
            ['/cc']: {
                target: 'http://tcc.taobao.com/', 
                changeOrigin: true, // 将主机头的源更改为目标URL
                cookieDomainRewrite: {
                    "*": getIp()
                }
            },
            ['/xw']: {
                target: 'https://bm.jindanlicai.com/', 
                changeOrigin: true, // 将主机头的源更改为目标URL
                cookieDomainRewrite: {
                    "*": getIp()
                }
            },
            ['/test']: {
                target: 'http://koa2.bigqianduan.top/', 
                changeOrigin: true, // 将主机头的源更改为目标URL
                cookieDomainRewrite: {
                    "*": getIp()
                }
            },
        },
    }
}
