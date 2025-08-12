import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
const handler = async (m) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  if (!mime) throw `${lenguajeGB['smsAvisoMG']()}*𝗥𝗘𝗦𝗣𝗢𝗡𝗗𝗔 𝗔 𝗨𝗡𝗔 𝗜𝗠𝗔𝗚𝗘𝗡 𝗢 𝗩𝗜𝗗𝗘𝗢*\n*𝗥𝗘𝗦𝗣𝗢𝗡𝗗 𝗧𝗢 𝗔𝗡 𝗜𝗠𝗔𝗚𝗘 𝗢𝗥 𝗩𝗜𝗗𝗘𝗢*`;
  const media = await q.download();
  const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
  const link = await (isTele ? uploadImage : uploadFile)(media);
  m.reply(`*╭━━━━━━━━━━━━━━━━━━━━*\n*┃ 𝗘𝗡𝗟𝗔𝗖𝗘 | 𝗟𝗜𝗡𝗞:*\n*┃ ${link}*\n*╰━━━━━━━━━━━━━━━━━━━━*`);
};
handler.help = ['tourl <reply image>'];
handler.tags = ['sticker'];
handler.command = /^(url)$/i;
export default handler;