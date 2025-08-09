import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const prompt = args.join(' ')
  if (!prompt) return m.reply(
`_Describe la imagen que quieres generar._`)

  try {
    // Reaccionar con reloj mientras genera
    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    // Llamada a tu API que devuelve la imagen directamente
    const api = `https://myapiadonix.vercel.app/api/IAimagen?prompt=${encodeURIComponent(prompt)}`
    const res = await fetch(api)
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`)

    // Convertir la respuesta en buffer (imagen)
    const buffer = await res.buffer()

    // Enviar la imagen al chat
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `
_*Imagen generada de:* ${prompt}_`.trim()
    }, { quoted: m })

    // Reaccionar con check
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('Error generando imagen:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('_Ocurrió un error, inténtalo más tarde._')
  }
}

handler.command = ['imgia', 'iaimg', 'dalle', 'dall-e']
handler.help = ['imgia']
handler.tags = ['ia']

export default handler