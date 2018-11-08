import Vue from 'vue'
import Vuex from 'vuex'
import api from '../assets/api/index.js'

Vue.use(Vuex)

const fetch = function(name) {
    return function({commit}, req) {
        return new Promise((resolve, reject) => { // asyncData() 可执行 .then()
            api.get(req.url, req.data, req.cookies)
            .then(res => {
                commit(name, res)
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}

export function createStore() {
    return new Vuex.Store({
        state: {
            Loading: { // 全局 loading
                show: false, // Array || Boolean
                hide: false,
            },
            Toast: { // 全局 toast
                show: '', // Array || String
                hide: false,
            },

            tel: '',
            user: {},
            koa2: {}
        },
        // getters: {
        //     user(state) {
        //         return state.user
        //     }
        // },
        mutations: {
            getUser(state, res) {
                state.user = res
            },
            koa2(state, res) {
                state.koa2 = res
            }
        },
        // 接受一个与 store 实例具有相同方法和属性的 context 对象 context.commit context.state context.getters 用解构赋值简化操作
        actions: {
            getUser: fetch('getUser'),
            koa2: fetch('koa2'),
        },
    })
}