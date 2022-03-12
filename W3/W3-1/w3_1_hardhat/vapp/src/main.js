import Vue from 'vue'
import App from './App.vue'

import Message from 'vue-m-message'
import 'vue-m-message/dist/index.css'
Vue.use(Message) // will mount `Vue.prototype.$message`

Vue.config.productionTip = false

//在main.js 中，会把APP.vue的组件的内容渲染到id 为app的div标签内
//cd vapp  启动 npm run serve
new Vue({
  render: h => h(App)
}).$mount('#app')