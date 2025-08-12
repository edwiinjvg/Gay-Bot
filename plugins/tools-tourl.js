import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `_Por favor, responde a una *Imagen* o *Vídeo* para obtener un enlace._`, m);
  }
  
  const q = m.quoted;
  const mime = (q.msg || q).mimetype || '';
  
  if (!mime) {
    return conn.reply(m.chat, `_Por favor, responde a una *Imagen* o *Vídeo* para obtener un enlace._`, m);
  }
  
  try {
    const media = await q.download();
    const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    const link = await (isTele ? uploadImage : uploadFile)(media);
    
    await conn.reply(m.chat, `*╭━━━━━━━━━━━━━━━━━━━━*\n*┃ 𝗘𝗡𝗟𝗔𝗖𝗘 | 𝗟𝗜𝗡𝗞:*\n*┃ ${link}*\n*╰━━━━━━━━━━━━━━━━━━━━*`, m);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '_Ocurrió un error al subir el archivo. Inténtalo de nuevo más tarde._', m);
  }
};

handler.help = ['url <reply image>'];
handler.tags = ['sticker'];
handler.command = /^(url)$/i;

export default handler;
