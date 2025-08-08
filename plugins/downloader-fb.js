import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(
    `📥 Uso correcto:
${usedPrefix + command} <enlace válido de Facebook>

Ejemplo:
${usedPrefix + command} https://www.facebook.com/watch/?v=1234567890`
  )

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    let api = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(args[0])}`
    let res = await fetch(api)
    let json = await res.json()

    if (!Array.isArray(json) || json.length === 0) throw new Error('Respuesta inválida de la API')

    for (let item of json) {
      if (!item.url || !item.resolution) continue

      let caption = `
🎬 Resolución: *${item.resolution}*
📎 Archivo: *${item.url.endsWith('.mp4') ? item.url.split('/').pop() : 'Descarga disponible'}*`.trim()

      await conn.sendMessage(m.chat, {
        video: { url: item.url },
        caption,
        fileName: `${item.resolution.replace(/\s/g, '_')}.mp4`,
        mimetype: 'video/mp4',
        contextInfo: {
          externalAdReply: {
            title: 'Descarga Facebook',
            body: item.resolution,
            thumbnailUrl: item.thumbnail,
            sourceUrl: args[0],
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ No se pudo obtener el video. Verifica el enlace e intenta nuevamente.')
  }
}

handler.command = ['facebook', 'fb', 'fbvideo']
handler.help = ['fb']
handler.tags = ['downloader']

export default handler