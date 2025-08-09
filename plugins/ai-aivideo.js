import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `_Describe el video que quieres generar._`, m);

  try {
    let wait = await conn.sendMessage(m.chat, { 
      text: '_Generando tu video, espera un momento..._' 
    }, { quoted: m });

    
    let apiURL = `https://myapiadonix.vercel.app/api/veo3?prompt=${encodeURIComponent(text)}&apikey=adonixveo3`;
    
    let res = await fetch(apiURL);
    let json = await res.json();

    if (!json.success || !json.video_url) throw new Error(json.message || '_No se pudo generar el video_');

    
    let video = await fetch(json.video_url);
    let buffer = await video.buffer();

    await conn.sendMessage(m.chat, { 
      video: buffer, 
      caption: `_*Video generado de:* ${json.prompt}_`, 
      gifPlayback: false 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: wait.key });
  } catch (e) {
    await conn.reply(m.chat, `_*Error generando el video:* ${e.message || e}_`, m);
  }
};

handler.help = ['aivideo'];
handler.tags = ['ia'];
handler.command = ['aivideo', 'videoai', 'iavideo', 'iavid', 'aivid'];

export default handler;