import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function switchVersion(version) {
  const src = getDistDir(version)
  const dest = path.join(src, '..')
  console.log(`[frontend-shared] switch lib to vue version ${version}`)
  copyDir(src, dest)
}

function getDistDir(version) {
  const dirname = String(version).startsWith('2') ? 'v2' : 'v3'
  return path.join(__dirname, `../dist/${dirname}/`)
}

function copyDir(src, dest) {
  console.log(`copying from ${src} to ${dest}`)
  // unlink for pnpm, #92
  try {
    fs.unlinkSync(dest)
  } catch (error) {}
  try {
    copyRecursiveSync(src, dest)
  } catch (error) {
    console.log('===error====');
    console.error(error)
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = stats && stats.isDirectory()
  if (isDirectory) {
    !fs.existsSync(dest) && fs.mkdirSync(dest)
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

function removeDir(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i])
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath)
    } else {
      //删除文件
      fs.unlinkSync(newPath)
    }
  }
  fs.rmdirSync(dir) //如果文件夹是空的，就将自己删除掉
}

export { getDistDir, copyDir, switchVersion, removeDir }
