// 处理es6代码转换
import babel from '@rollup/plugin-babel'
// 告诉rollup如何查找外部模块并安装
import resolve from '@rollup/plugin-node-resolve'
// 可以导入已有的cjs模块，使rollup可以识别它
import commonjs from '@rollup/plugin-commonjs'
// 样式文件处理
import postcss from 'rollup-plugin-postcss'
// 处理css定义的变量
import simplevars from 'postcss-simple-vars'
// 处理less嵌套样式写法
import nested from 'postcss-nesting'
// css代码压缩
import cssnano from 'cssnano'
// px转换vw
import pxtovw from 'postcss-px-to-viewport'
// 代码压缩
import { terser } from 'rollup-plugin-terser'
// 处理css文件引入的图片
import url from 'postcss-url'
// 处理template图片
import image from '@rollup/plugin-image'
// json处理
import json from '@rollup/plugin-json'
// vue2打包
import createVuePlugin2 from 'rollup-plugin-vue2'
// vue3打包
import createVuePlugin3 from 'rollup-plugin-vue3'
// vue2 支持 setup语法
import ScriptSetup from 'unplugin-vue2-script-setup/rollup'

import { getDistDir } from './scripts/utils.mjs'
import { isVue2, version } from 'vue-demi'

console.log('=====rollup isVue2=====', isVue2)
// 入口文件
const entry = 'src/index.js'

// babel配置
const babelOptions = {
  presets: ['@babel/preset-env'],
  exclude: '**/node_modules/**',
}

// postcss-px-to-viewport配置
const pxtovwOptions = {
  unitToConvert: 'px', //需要转换的单位，默认为"px"；
  viewportWidth: 375, //设计稿的视口宽度
  unitPrecision: 8, //单位转换后保留的小数位数
  propList: ['*'], //要进行转换的属性列表,*表示匹配所有,!表示不转换
  viewportUnit: 'vw', //转换后的视口单位
  fontViewportUnit: 'vw', //转换后字体使用的视口单位
  selectorBlackList: ['html', '.no-transform-px'], //不进行转换的css选择器，继续使用原有单位
  minPixelValue: 0, //设置最小的转换数值
  mediaQuery: true, //设置媒体查询里的单位是否需要转换单位
  replace: true, //是否直接更换属性值，而不添加备用属性
  exclude: [/node_modules/], //忽略某些文件夹下的文件
}

// rollup配置
export default {
  // 入口
  input: entry,
  // 打包信息
  output: [
    {
      file: getDistDir(version) + 'index.es.js',
      format: 'es',
    },
    {
      file: getDistDir(version) + 'index.cjs.js',
      format: 'cjs',
      exports: 'default',
    },
    {
      file: getDistDir(version) + 'index.umd.js',
      format: 'umd',
      name: 'bundle',
    },
  ],
  // 将模块视为外部模块，不会打包在库中，这里视项目具体情况自行调整 如： '@ant-design/icons',
  external: ['vue', 'vue-demi'],
  // 插件配置
  plugins: [
    json(),
    isVue2 ? ScriptSetup() : undefined,
    isVue2
      ? createVuePlugin2({
          css: false,
        })
      : createVuePlugin3({ preprocessStyles: true }),
    image(),
    postcss({
      plugins: [
        nested(),
        url({ url: 'inline', maxSize: 10 }),
        new pxtovw(pxtovwOptions),
        simplevars(),
        cssnano(),
      ],
      extensions: ['.css', 'less'],
    }),
    resolve({
      extensions: ['.vue'], // 无后缀名引用时，需要识别 .vue 文件
      exclude: '**/node_modules/**', // 排除node_modules
    }),
    commonjs(),
    babel(babelOptions),
    terser(),
  ],
}
