import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import webp from 'node-webpmux'

async function addExif(webpSticker, packname, author) {
  const img = new webp.Image()
  const stickerPackId = crypto.randomBytes(32).toString('hex')
  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
  }
  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ])
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

let handler = async (m, { conn, text }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/webp/.test(mime)) return m.reply('_Responde a un sticker para cambiar el wm._')
  
  const externalAdReply = {
    title: global.packname,
    body: global.author,
    mediaType: 1,
    renderLargerThumbnail: false,
    sourceUrl: global.group ? global.group.contextInfo.externalAdReply.sourceUrl : '',
    thumbnail: fs.readFileSync('./storage/img/menu.jpg'),
  };

  let [packname, author] = text.split('|').map(v => v.trim())
  if (!packname) packname = global.packname
  if (!author) author = global.author

  let media = await q.download()
  let buffer = await addExif(media, packname, author)
  
  await conn.sendMessage(m.chat, { 
    sticker: buffer,
    contextInfo: {
      externalAdReply: externalAdReply
    }
  }, { quoted: m })
}

handler.help = ['wm']
handler.tags = ['sticker']
handler.command = ['wm', 'take', 'robarsticker']

export default handler
