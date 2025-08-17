import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['573005094862', 'Edwin', true],
]

global.mods = []
global.prems = []

global.namebot = '𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.packname = 𝙂𝙖𝙮𝘽𝙤𝙩 🤖'
global.author = 'Edwin'
global.vs = '2.2.0'

// --- AÑADE ESTO ---
global.group = {
    externalAdReply: {
        title: '𝙂𝙖𝙮𝘽𝙤𝙩 🤖',
        body: 'grupo',
        mediaType: 1,
        renderLargerThumbnail: true,
        thumbnailUrl: 'https://i.ibb.co/L951y2D/thumbnail-personalizado.jpg',
        sourceUrl: 'https://chat.whatsapp.com/TuEnlaceDeGrupo', // Cambia esto por el enlace de tu grupo
    }
}
// --- FIN DEL CÓDIGO ---


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Se actualizó 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
