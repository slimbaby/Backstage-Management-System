import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体文件css
import './assets/fonts/iconfont.css'
// 导入axios.并挂载到vue原型身上，使全局使用
import axios from 'axios'
// 设定根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
// 等拦截设定好再挂载到vue原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
