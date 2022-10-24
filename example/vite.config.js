import { defineConfig } from 'vite'
import { injectHtml, minifyHtml } from 'vite-plugin-html'
import { isVue2 } from 'vue-demi'
import vue3 from '@vitejs/plugin-vue'
import { createVuePlugin } from 'vite-plugin-vue2'
import * as compiler from '@vue/compiler-sfc'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import path from 'path'

const resolve = (str) => {
  console.log(path.resolve(__dirname, str))
  return path.resolve(__dirname, str)
}

export default defineConfig({
  resolve: {
    alias: {
      vue: isVue2
        ? resolve('../node_modules/vue2')
        : resolve('../node_modules/vue3'),
    },
  },
  root: './',
  base: './',
  mode: 'development',
  plugins: [
    isVue2
      ? createVuePlugin()
      : vue3({
          compiler: compiler,
        }),
    isVue2 ? ScriptSetup() : undefined,
    minifyHtml(), // 压缩 HTML
    injectHtml({
      // 入口文件 index.html 的模板注入
      injectData: {
        // 模板注入的数据
        htmlWebpackPlugin: {
          options: {
            isVite: true,
          },
        },
      },
    }),
  ],
  server: {
    open: true, // 是否自动打开浏览器
    host: '0.0.0.0',
  },
})
