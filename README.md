
# vue 服务端渲染模板 webpack 配置  
    

## 版本

```
webpack 3.8 
express 4 
vue 2.5 
vue-loader 15
```


## 启动命令

```bash
git clone  git@github.com:cjm0/vssr.git 
yarn
yarn run dev     本地启动
yarn run build   打包
yarn start       线上启动 会压缩代码 修改要重启
yarn run pm2     线上pm2启动 可持续运行 
```

## 获取数据

1. asyncData axios   

    获取到的数据只在本页面有效，每个都是独立的新建的模块  

    对于一次性不变的设置缓存 减轻服务器压力  

    可以被 `seo` 爬虫抓取

2. mounted axios 

    获取的数据是页面渲染后的，不会被爬
      

## babelrc es6 编译

    `stage-2` 支持...扩展运算符  

    `syntax-dynamic-import`，`import` 可以导入 `export` 的文件，不能和 `transform-runtime` 同时使用


## 注意

1. 核心入口文件 `server.js` 根据环境，引入不同的构建依赖  

2. 启用跨域代理，本地线上都要用

3. 把所有的地址访问请求统一拦截处理后，指向模板，渲染对应数据，渲染好数据后发送到浏览器

4. `public` 里面的文件不会被处理

5. 每次修改重新打包，如果 `public` 里面引用的 `css js img` 等资源发生了改动，需要手动加时间戳消除缓存

6. 外部js、重置样式表 reset.css  全部放 public 文件 要自己压缩


## 地址

[vue 服务端渲染模板](http://vssr.bigqianduan.top)

## License

[MIT](./License)




