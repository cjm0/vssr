import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {path: '/', component: () => import('../pages/index/index.vue')},
            {path: '/list', component: () => import('../pages/list/index.vue')}
        ]
    })
}




