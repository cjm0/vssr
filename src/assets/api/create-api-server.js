/* 
    创建服务端axios请求
    create-api-server.js
*/
import LRU from 'lru-cache' // 缓存
import qs from 'qs' // 序列化参数
import md5 from 'md5' // md5加密
import axios from 'axios'
const ajax = axios.create({
    withCredentials: true, // 允许传cookie
})

ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

let config = {
    cached: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
    })
}

export function createAPI({server}) {
    let api
    if (process.__API__) {
        api = process.__API__
    } else {
        api = process.__API__ = {
            get(url, params = {}, cookies = {}) {
                return new Promise((resolve, reject) => {
                    const key = md5(url + JSON.stringify(params))
                    if (config.cached && config.cached.has(key)) { // 有缓存取缓存
                        resolve(config.cached.get(key))
                    } else {
                        ajax({
                            method: 'get',
                            url: server.baseURL + url,
                            params,
                            headers: {
                                'Cookie': cookies // 把浏览器cookie传给后台
                            }
                        })
                        .then(res => {
                            if (config.cached && params.cache) { // 设置缓存
                                config.cached.set(key, res.data)
                            }
                            resolve(res.data)
                        }).catch(err => {
                            reject(err)
                        })
                    }
                })
            },
            post(url, params = {}, cookies = {}) {
                return new Promise((resolve, reject) => {
                    const key = md5(url + JSON.stringify(params))
                    if (config.cached && config.cached.has(key)) {
                        resolve(config.cached.get(key))
                    } else {
                        ajax({
                            method: 'post',
                            url: server.baseURL + url,
                            data: qs.stringify(params), // 用qs.stringify(data)包一下, 主要是配合下面headers里的Content-Type, 转成表单提交, 让后端可以直接用 $_POST 拿到数据
                            headers: {
                                'Cookie': cookies
                            }
                        })
                        .then(res => {
                            if (config.cached && params.cache) { // 设置缓存
                                config.cached.set(key, res.data)
                            }
                            resolve(res.data)
                        }).catch(err => {
                            reject(err)
                        })
                    }
                })
            },
        }
    }
    return api
}

