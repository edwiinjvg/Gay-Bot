import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['573005094862@s.whatsapp.net', 'Edwin', true],
]

global.mods = []
global.prems = []

global.namebot = '𝗚𝗮𝘆𝗕𝗼𝘁 🤖'
global.packname = '𝗚𝗮𝘆𝗕𝗼𝘁 🤖'
global.author = 'Edwin'
global.moneda = '.'

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.sessions = 'Sessions'
global.jadi = 'JadiBots'
global.yukiJadibts = true

global.namecanal = '🏳️‍🌈'
global.idcanal = ''
global.idcanal2 = ''
global.canal = ''
global.canalreg = ''

global.ch = {
  ch1: '120363420941524030@newsletter'
}

global.multiplier = 69
global.maxwarn = '3'



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
