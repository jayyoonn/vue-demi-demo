import { Vue, isVue3, createApp } from 'vue-demi'
import App from './app.vue'
import Loading from '../src/index'

if (isVue3) {
  createApp(App).use(Loading).mount('#root')
} else {
  Vue.use(Loading)
  new Vue({
    el: '#root',
    render: (h) => h(App),
  })
}
