import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, text, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `_Escribe lo que quieres buscar en Youtube._`,
    ...global.rcanal
  }, { quoted: m })

  await m.react('🔍')

  // Nombre del bot o subbot
  const botJid = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
  const configPath = path.join('./JadiBots', botJid, 'config.json')
  let nombreBot = global.namebot || ''
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      if (config.name) nombreBot = config.name
    } catch (err) {
      console.log('❌ Error leyendo config del subbot:', err)
    }
  }

  const imgPath = './storage/img/ytsearch.jpg'

  try {
    const results = await yts(text)
    const videos = results.videos.slice(0, 5)

    if (!videos.length) {
      await conn.sendMessage(m.chat, {
        text: `_No encontré nada relacionado con *${text}*._`,
        ...global.rcanal
      }, { quoted: m })
      await m.react('❌')
      return
    }

    let caption = `- _*Resultados para:* ${text}_\n\n`

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]
      caption += `- _*${i + 1}.* *${video.title}*_\n\n`
      caption += `- _*Descripción:* ${video.description?.slice(0, 100) || 'Sin descripción'}_\n`
      caption += `- _*Autor:* ${video.author.name}_\n\n`
      caption += `- _*Duración:* ${video.timestamp}_\n\n`
      caption += `- _*Publicación:* ${video.ago}_\n\n`
      caption += `- _*Link:*_ _${video.url}_\n\n`
    }


    const messagePayload = /^https?:\/\//.test(imgPath)
      ? { image: { url: imgPath } }
      : { image: fs.readFileSync(imgPath) }

    await conn.sendMessage(m.chat, {
      ...messagePayload,
      caption: caption.trim(),
      mentions: conn.parseMention(caption),
      ...global.rcanal
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: `_Ocurrió un error, inténtalo de nuevo._`,
      ...global.rcanal
    }, { quoted: m })
    await m.react('❌')
  }
}

handler.tags = ['search']
handler.help = ['ytsearch']
handler.command = ['ytsearch', 'yts', 'youtubesearch']
handler.register = true

export default handler