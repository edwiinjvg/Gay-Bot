import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

global.prefix = ['.', '-', '/']
global.owner = [
  ['573005094862', 'Edwin', true],
]

global.mods = []
global.prems = []

global.namebot = '𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.packname = '𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.author = '𝘉𝘺 𝘌𝘥𝘸𝘪𝘯'
global.vs = '2.0'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
