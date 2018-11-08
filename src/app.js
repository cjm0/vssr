import Vue from 'vue'
import App from './App.vue'
import {createStore} from './store'
import {createRouter} from './router'
import {sync} from 'vuex-router-sync'
import './assets/common.less'
import components from './components'
import * as filters from './assets/util/filters'
import titleMixin from './assets/util/title'


// 定义全局公用ajax 请求数据不需要后端渲染时在mounted中请求
import axios from 'axios'
Object.defineProperty(Vue.prototype, 'axios', {value: axios}) 
axios.defaults.withCredentials = true // 是否携带cookie信息

axios.interceptors.request.use(res => { // 添加请求拦截器
    return res;
}, err => {
    return Promise.reject(err);
});

axios.interceptors.response.use(res => { // 添加响应拦截器 
    return res
}, err => {
    Promise.reject(err)
})

axios.defaults.transformRequest = [function (data) { // 用于请求之前对请求数据进行操作
    var ret = []
    for (var it in data) {
        ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
    }
    return ret.join('&')
}]



// 全局引入组件
Object.keys(components).forEach(key => Vue.component(key, components[key]))

// 引入全局的过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 混入头部管理函数
Vue.mixin(titleMixin)

// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
export function createApp() {
    const store = createStore()
    const router = createRouter()

    sync(store, router) // 同步路由状态(route state)到 store

    router.beforeEach((to, from, next) => { // 路由跳转前拦截
        // store.state.Loading.show = true
        next()
    })

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })
    return {app, router, store}
}

