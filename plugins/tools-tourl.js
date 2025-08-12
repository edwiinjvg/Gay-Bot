import fetch from 'node-fetch';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { Blob } from 'formdata-node';
import { FormData } from 'formdata-node';

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `📍 *Responde a una imagen, sticker, video o audio para subirlo a Catbox.*`, m);

  await m.react("📤");

  try {
    let media = await q.download();
    let link = await catbox(media);

    let txt = `*乂 U P L O A D E R 乂*\n\n`;
    txt += `🌐 *Enlace:* ${link}\n`;
    txt += `📦 *Tamaño:* ${formatBytes(media.length)}\n\n`;

    await conn.reply(m.chat, txt, m);
    await m.react("✅");
  } catch (e) {
    console.error(e);
    await m.react("❌");
    return conn.reply(m.chat, `⚠️ Error al subir el archivo a Catbox.`, m);
  }
};

handler.help = ['catbox', 'tourl'];
handler.tags = ['tools'];
handler.command = ['catbox', 'tourl'];
handler.register = true;

export default handler;

// 📦 Formatear tamaño de archivos
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// 🐱 Subir archivo a Catbox
async function catbox(content) {
  const { ext, mime } = (await fileTypeFromBuffer(content)) || { ext: 'bin', mime: 'application/octet-stream' };
  const blob = new Blob([content], { type: mime });
  const formData = new FormData();
  const randomName = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, `${randomName}.${ext}`);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const text = await response.text();
  if (!text.includes('https://')) throw 'No se pudo subir el archivo';
  return text;
}
