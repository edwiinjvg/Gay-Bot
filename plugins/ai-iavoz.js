import fetch from 'node-fetch'

async function streamToBuffer(stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `_Escribe un texto para hablar con la IA._`, m)

  try {
    await conn.sendPresenceUpdate('recording', m.chat)

    const res = await fetch(`https://myapiadonix.vercel.app/api/adonixvoz?q=${encodeURIComponent(text)}`)

    if (!res.ok) throw new Error('_Ocurrió un error, inténtalo más tarde._')

    const bufferAudio = await streamToBuffer(res.body)

    await conn.sendMessage(m.chat, {
      audio: bufferAudio,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '_Ocurrió un error, inténtalo más tarde', m)
  }
}

handler.command = ['iavoz', 'aivoz']
handler.help = ['iavoz']
handler.tags = ['ia']
export default handler