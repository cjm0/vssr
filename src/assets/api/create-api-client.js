/*
    创建客户端axios请求
    create-api-client.js
*/
import qs from 'qs'
import axios from 'axios'
const ajax = axios.create({
    withCredentials: true, // 允许传cookie
})

ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

ajax.interceptors.response.use((res) => { // 添加响应拦截器 
    if (res.data.code >= 200 && res.data.code < 300) {
        return res
    }
    return Promise.reject(res.data)
}, err => { 
    return Promise.reject(err)
})

export function createAPI({client}) {
    return {
        get(url, params = {}) {
            return new Promise((resolve, reject) => {
                ajax({
                    method: 'get',
                    url: url,
                    params
                })
                .then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        post(url, params = {}) {
            return new Promise((resolve, reject) => {
                ajax({
                    method: 'post',
                    url: url,
                    data: qs.stringify(params)
                })
                .then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /*
            all(arr) {
                return new Promise((resolve, reject) => {
                    ajax.all(arr)
                    .then(ajax.spread((res1, res2) => {
                        resolve(res.data)
                    })).cateh(err => {
                        reject(err)
                    })
                })
            },
        */
    }
}













