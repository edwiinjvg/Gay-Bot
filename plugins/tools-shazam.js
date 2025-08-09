import acrcloud from 'acrcloud'

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})
let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (/video|audio/.test(mime)) {
  let buffer = await q.download()
  let { status, metadata } = await acr.identify(buffer)
  if (status.code !== 0) throw status.msg 
  let { title, artists, album, genres, release_date } = metadata.music[0]
      txt += `
_ *Titulo:* ${title} ${artists ? `\n- _*Artista:* ${artists.map(v => v.name).join(', ')}` : ''}`
      txt += `${album ? `\n- _*Album:* ${album.name}_` : ''}${genres ? `\n- _*Género:* ${genres.map(v => v.name).join(', ')}` : ''}_\n`
      txt += `- _*Fecha de lanzamiento:* ${release_date}_\n`
      txt += `╰─⬣`
     conn.reply(m.chat, txt, m)
  } else return conn.reply(m.chat, `_Envia o responde a un audio o video de poca duración para ver que música contiene._`, m)
}
handler.help = ['whatmusic <audio/video>']
handler.tags = ['tools']
handler.command = ['shazam', 'whatmusic']
handler.register = true 
export default handler