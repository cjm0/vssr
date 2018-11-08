import config from 'config'
import {createAPI} from 'create-api' // 此处不同打包环境引入的不一样，做了别名处理

const api = createAPI(config.ajax)

export default api

