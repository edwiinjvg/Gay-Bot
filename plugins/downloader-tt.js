import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(
    `_Ingresa el link del video que quieres descargar._`
  )

  try {
    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    let apiURL = `https://myapiadonix.vercel.app/api/tiktok?url=${encodeURIComponent(args[0])}`
    let response = await fetch(apiURL)
    let data = await response.json()

    if (data.status !== 200 || !data.result?.video)
      throw new Error('_No se pudo obtener el video._')

    let info = data.result

    let caption = `- _*Título:* ${info.title}_\n- _*Autor:* @${info.author.username || 'Desconocido'}_\n- _*Duración:* ${info.duration || 'N/D'}s_\n- _*Likes:* ${info.likes?.toLocaleString() || 0}_\n- _*Comentarios:* ${info.comments?.toLocaleString() || 0}_\n- _*Compartidos:* ${info.shares?.toLocaleString() || 0}_\n- _*Vistas:* ${info.views?.toLocaleString() || 0}_`.trim()

    await conn.sendMessage(m.chat, {
      video: { url: info.video },
      caption,
      fileName: `${info.title}.mp4`,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `Autor: ${info.author.name || 'Desconocido'}`,
          thumbnailUrl: info.thumbnail,
          sourceUrl: args[0],
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ No se pudo procesar el video. Intenta nuevamente más tarde.')
  }
}

handler.command = ['tiktok', 'tt']
handler.help = ['tiktok']
handler.tags = ['downloader']

export default handler