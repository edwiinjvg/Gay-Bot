import fetch from 'node-fetch'

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`_Ingresa el link del video o foto que quieres descargar junto con el comando._`)

  try {
    m.react('⌛')
    const res = await fetch(`https://api.dorratz.com/igdl?url=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.data || !json.data.length) throw 'No se pudo obtener el contenido'

    for (let media of json.data) {
      await conn.sendFile(m.chat, media.url, 'igdl.mp4', `_Aquí tienes :D_`, m, false, {
        thumbnail: media.thumbnail ? await (await fetch(media.thumbnail)).buffer() : null,
        mimetype: 'video/mp4'
      })
    }

  } catch (e) {
    console.error(e)
    m.reply('_Ocurrió un error, inténtalo de nuevo._')
  }
}

handler.help = ['ig <url>']
handler.tags = ['downloader']
handler.command = ['ig', 'instagram']

export default handler
