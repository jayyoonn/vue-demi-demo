import Component from './index.vue'
import { Vue, isVue3 } from 'vue-demi'

// 默认选项
const defaultOpts = {
  text: 'Loading...',
  forbid: true,
  duration: undefined,
}

const Vue3Install = (App) => {
  let timer
  let Loading
  let vNodeDom

  class LoadingProperties {
    show(options) {
      if (Loading) return
      let opts = { ...defaultOpts }
      switch (Object.prototype.toString.call(options)) {
        case '[object Object]':
          opts = { ...defaultOpts, ...options }
          break
        case '[object Number]':
          opts.duration = options
          break
        case '[object Bollean]':
          opts.forbid = options
          break
        case '[object String]':
          opts.text = options
          break
        default:
          break
      }

      // 把template创建成vnodes（虚拟DOM）
      Loading = Vue.h(Component, { text: opts.text, forbid: opts.forbid })
      vNodeDom = document.createElement('div')

      document.body.appendChild(vNodeDom)
      Loading.appContext = App._context

      Vue.render(Loading, vNodeDom)

      if (opts.duration) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.hide()
        }, opts.duration)
      }
    }
    hide() {
      if (Loading) {
        Loading = null
        clearTimeout(timer)
        document.body.removeChild(vNodeDom)
      }
    }
  }

  App.config.globalProperties.$loading = new LoadingProperties()
}

const Vue2Install = (App) => {
  let timer
  let instance

  class LoadingProperties {
    show(options) {
      if (instance) return
      let opts = { ...defaultOpts }
      switch (Object.prototype.toString.call(options)) {
        case '[object Object]':
          opts = { ...defaultOpts, ...options }
          break
        case '[object Number]':
          opts.duration = options
          break
        case '[object Bollean]':
          opts.forbid = forbid
          break
        case '[object String]':
          opts.text = options
          break
        default:
          break
      }

      const LoadingConstructor = Vue.extend(Component)
      instance = new LoadingConstructor({
        propsData: { ...opts },
      })

      document.body.appendChild(instance.$mount().$el)

      if (opts.duration) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.hide()
        }, opts.duration)
      }
    }
    hide() {
      if (instance) {
        document.body.removeChild(instance.$mount().$el)
        instance = null
        clearTimeout(timer)
      }
    }
  }

  Vue.prototype.$loading = new LoadingProperties()
}

export default {
  install: isVue3 ? Vue3Install : Vue2Install,
}
