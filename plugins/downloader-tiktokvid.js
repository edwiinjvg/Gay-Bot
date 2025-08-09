import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
  if (!text) return m.reply(`_Escribe lo que quieres buscar en TikTok._`)

  let res = await fetch(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(text)}`)
  let json = await res.json()

  if (!json.status || !json.data || !json.data.length) return m.reply('_No se encontró ningún video._')

  let vid = json.data[0]

  let caption = `${vid.title}\n\n` +
                `- _*Autor:* ${vid.author}_\n` +
                `- _*Vistas:* ${vid.views.toLocaleString()}_\n` +
                `_*Link:* ${vid.url}_`

  await conn.sendMessage(m.chat, {
    video: { url: vid.url },
    caption
  }, { quoted: m })
}

handler.help = ['tiktokvid']
handler.tags = ['downloader']
handler.command = ['tiktokvid', 'playtiktok']
handler.register = true
export default handler