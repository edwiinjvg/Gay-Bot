import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const script = join(__dirname, 'main.js')

console.clear()
console.log('Iniciando GayBot... ⌛')

cfonts.say('GayBot 🤖', {
  font: 'block',        
  align: 'center',
  gradient: ['cyan', 'magenta'],
  env: 'node'
})

cfonts.say('Autor: Edwin 👤', {
  font: 'console',     
  align: 'center',
  gradient: ['cyan', 'white'],
  env: 'node'
})

let is      = false

function start(file) {
  if (is) return
  is = true
  
  const child = fork(file)
  
  child.on('message', data => {
    console.log('[REINICIANDO]', data)
    switch (data) {
      case 'reset':
        child.kill()
        is = false
        start.apply(this, arguments)
        break
      case 'uptime':
        child.send(process.uptime())
        break
    }
  })
  
  child.on('exit', (code, signal) => {
    is = false
    console.error(`Ocurrió un error con código ${code} y señal ${signal}`)
    start(file)
  })

  // Reiniciar si se detectan cambios en el archivo
  watchFile(file, () => {
    unwatchFile(file)
    console.log('Archivo actualizado, reiniciando...')
    start(file)
  })
}

start(script)
