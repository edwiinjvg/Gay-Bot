import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['573005094862', 'Edwin', true],
]

global.mods = []
global.prems = []

global.namebot = '𝗚𝗮𝘆𝗕𝗼𝘁 🤖'
global.packname = '𝗚𝗮𝘆𝗕𝗼𝘁 🤖'
global.author = 'Edwin'
global.vs = '2.2.0'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
