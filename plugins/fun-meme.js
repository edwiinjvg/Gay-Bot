import axios from 'axios'

const handler = async (m, { conn }) => {
  try {
    const res = await axios.get('https://g-mini-ia.vercel.app/api/meme')
    const memeUrl = res.data.url

    if (!memeUrl) {
      return conn.sendMessage(m.chat, {
        text: '_No se pudo obtener el meme._',
        ...global.rcanal
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      image: { url: memeUrl },
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: '-Ocurrió un error, inténtalo de nuevo._',
      ...global.rcanal
    }, { quoted: m })
  }
}

handler.command = ['meme', 'momo']
handler.help = ['meme']
handler.tags = ['fun']
export default handler
