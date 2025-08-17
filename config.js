import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['573005094862', 'Edwin', true],
]

global.mods = []
global.prems = []

global.namebot = '𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.packname = '𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.author = 'Edwin'
global.vs = '2.2.0'

// --- AÑADE ESTO ---
global.group = {
    externalAdReply: {
        title: '𝙂𝙖𝙮𝘽𝙤𝙩 🤖',
        body: 'grupo',
        mediaType: 1,
        renderLargerThumbnail: false,
        thumbnailUrl: 'https://files.catbox.moe/bhsp52.jpg',
        sourceUrl: 'https://chat.whatsapp.com/Ht3wajnuYpK1ZSKZpD9RKs?mode=ac_t', // Cambia esto por el enlace de tu grupo
    }
}
// --- FIN DEL CÓDIGO ---


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
