import Vue from 'vue'
import 'es6-promise/auto'
import {createApp} from './app'
import ProgressBar from './components/ProgressBar.vue'

// 进度条，在文档之外渲染并且随后挂载
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

/*      
    增加异步获取数据方法
    组件内路由拦截 
    在当前路由改变，但是该组件被复用时调用
    可以访问组件实例 `this`
*/
Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const {asyncData} = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
})

const {app, router, store} = createApp()

// store 替换使 client rendering 和 server rendering 匹配
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

// 等到 router 将可能的异步组件和钩子函数解析完
router.onReady(() => {
    // 在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)

        // 我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
        const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

        // 没有异步钩子就跳过
        if (!asyncDataHooks.length) { 
            return next()
        }

        // 触发加载指示器
        bar.start()

        Promise.all(asyncDataHooks.map(hook => hook({store, route: to})))
        .then(() => {
            bar.finish() // 停止加载指示器
            next()
        })
        .catch(next)
    })

    // 挂载#app 
    app.$mount('#app')
})

// pwa service worker 缓存，只有https下才能用
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
}
