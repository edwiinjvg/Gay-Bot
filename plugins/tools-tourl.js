import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) {
        return conn.reply(m.chat, `_✨ Por favor, responde a una *Imagen* o *Vídeo* para obtener un enlace._`, m);
    }

    await m.react('⏳');
    
    try {
        let media = await q.download();
        let isTele = /image\/(png|jpe?g|gif)|video\/(mp4|webm)/.test(mime);
        
        let link = await (isTele ? uploadImage : uploadFile)(media);
        let shortlink = await shortUrl(link);
        let formattedSize = formatBytes(media.length);

        let txt = `
✅ *L I N K - E N L A C E* ✅

*» Enlace* : ${link}
*» Acortado* : ${shortlink}
*» Tamaño* : ${formattedSize}
*» Expiración* : No expira
        `.trim();

        await conn.reply(m.chat, txt, m);
        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.reply(m.chat, '_Ocurrió un error al subir el archivo. Inténtalo de nuevo más tarde._', m);
    }
}

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['tourl', 'upload'];

export default handler;

// --- Funciones auxiliares ---

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
    try {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
        return await res.text()
    } catch (e) {
        return url; // En caso de error, devuelve el enlace original
    }
}
