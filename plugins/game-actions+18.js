import { fileURLToPath } from 'url';
import path from 'path';

const handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) {
        return m.reply('_Este comando solo puede ser utilizado en grupos._');
    }

    if (!db.data.chats[m.chat].nsfw) {
        return m.reply(`_El contenido nsfw está desactivado en este grupo._`);
    }

    let who;
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        return m.reply(`_Menciona a un usuario o responde a un mensaje para usar *${usedPrefix + command}*._`);
    }

    // -- INICIO DE LA CORRECCIÓN --
    // Usamos el número de usuario en lugar del nombre para que la mención funcione
    let senderNumber = m.sender.split('@')[0];
    let targetNumber = who.split('@')[0];
    // -- FIN DE LA CORRECCIÓN --

    const mentions = [m.sender, who];
    
    let str;
    let videos;

    if (['fuck', 'follar', 'coger'].includes(command)) {
        videos = videoUrls.fuck;
        str = `_*@${senderNumber}* se cogió bien duro a *@${targetNumber}*_ 🥵`;
    }
    
    else if (['anal', 'culiar'].includes(command)) {
        videos = videoUrls.anal;
        str = `_*@${senderNumber}* le partió el culo a *@${targetNumber}*_ 🍑`;
    }
    
    else if (['blowjob', 'bj', 'mamada'].includes(command)) {
        videos = videoUrls.blowjob;
        str = `_*@${senderNumber}* le chupó la verga a *@${targetNumber}*_ 🍆`;
    }
    
    else if (['sixnine', '69'].includes(command)) {
        videos = videoUrls.sixnine;
        str = `_*@${senderNumber}* le está haciendo un 69 a *@${targetNumber}*_ 🥵`;
    }

    else if (['cum', 'leche'].includes(command)) {
        videos = videoUrls.cum;
        str = `_*@${senderNumber}* dejó todo lleno de leche a *@${targetNumber}*_ 🥛`;
    }
    
    else if (['grabboobs', 'agarrartetas'].includes(command)) {
        videos = videoUrls.grabboobs;
        str = `_*@${senderNumber}* le agarró las tetas a *@${targetNumber}*_ 🍒`;
    }

    else if (['spank', 'nalgada'].includes(command)) {
        videos = videoUrls.spank;
        str = `_*@${senderNumber}* le dió una nalgada a *@${targetNumber}*_ 👋`;
    }
    
    else if (['suckboobs', 'chupartetas'].includes(command)) {
        videos = videoUrls.suckboobs;
        str = `_*@${senderNumber}* le chupó las tetas a *@${targetNumber}*_ 👅`;
    }

    else if (['yuri', 'lesbianas', 'tijeras'].includes(command)) {
        videos = videoUrls.yuri;
        str = `_*@${senderNumber}* hizo tijeras con *@${targetNumber}*_ 🥵`;
    }
    
    if (videos) {
        const videoUrl = videos[Math.floor(Math.random() * videos.length)];
        conn.sendMessage(m.chat, { video: { url: videoUrl }, gifPlayback: true, caption: str, mentions }, { quoted: m });
    }
};

handler.help = [
    'fuck @tag', 'follar @tag', 'coger @tag', 'anal @tag', 'culiar @tag',
    'blowjob @tag', 'bj @tag', 'mamada @tag', 'sixnine @tag',
    '69 @tag', 'cum @tag', 'leche @tag', 'grabboobs @tag',
    'agarrartetas @tag', 'spank @tag', 'nalgada @tag',
    'suckboobs @tag', 'chupartetas @tag', 'lesbianas @tag', 
    'tijeras @tag', 'yuri @tag'
];
handler.tags = ['nsfw'];
handler.command = [
    'fuck', 'follar', 'coger', 'anal', 'culiar', 'blowjob', 'bj', 'mamada',
    'sixnine', '69', 'cum', 'leche', 'grabboobs', 'agarrartetas',
    'spank', 'nalgada', 'suckboobs', 'chupartetas', 'lesbianas',
    'tijeras', 'yuri'
];
handler.group = true;
export default handler;

// Video URLs para los comandos NSFW
const videoUrls = {
    fuck: [
        'https://telegra.ph/file/6ea4ddf2f9f4176d4a5c0.mp4', 'https://telegra.ph/file/66535b909845bd2ffbad9.mp4', 
        'https://telegra.ph/file/1af11cf4ffeda3386324b.mp4', 'https://telegra.ph/file/e2beba258ba83f09a34df.mp4', 
        'https://telegra.ph/file/21543bac2383ce0fc6f51.mp4', 'https://telegra.ph/file/1baf2e8577d5118c03438.mp4', 
        'https://telegra.ph/file/80aa0e43656667b07d0b4.mp4', 'https://telegra.ph/file/7638618cf43e499007765.mp4', 
        'https://telegra.ph/file/1c7d59e637f8e5915dbbc.mp4', 'https://telegra.ph/file/e7078700d16baad953348.mp4', 
        'https://telegra.ph/file/100ba1caee241e5c439de.mp4', 'https://telegra.ph/file/3b1d6ef30a5e53518b13b.mp4', 
        'https://telegra.ph/file/249518bf45c1050926d9c.mp4', 'https://telegra.ph/file/34e1fb2f847cbb0ce0ea2.mp4', 
        'https://telegra.ph/file/52c82a0269bb69d5c9fc4.mp4', 'https://telegra.ph/file/ca64bfe2eb8f7f8c6b12c.mp4', 
        'https://telegra.ph/file/8e94da8d393a6c634f6f9.mp4', 'https://telegra.ph/file/216b3ab73e1d98d698843.mp4', 
        'https://telegra.ph/file/1dec277caf371c8473c08.mp4', 'https://telegra.ph/file/bbf6323509d48f4a76c13.mp4', 
        'https://telegra.ph/file/f8e4abb6923b95e924724.mp4', 'https://telegra.ph/file/bd4d5a957466eee06a208.mp4', 
        'https://telegra.ph/file/a91d94a51dba34dc1bed9.mp4', 'https://telegra.ph/file/b08996c47ff1b38e13df0.mp4', 
        'https://telegra.ph/file/58bcc3cd79cecda3acdfa.mp4'
    ],
    anal: [ 'https://telegra.ph/file/a11625fef11d628d3c8df.mp4',
    ],
    blowjob: [
        'https://telegra.ph/file/0260766c6b36537aa2802.mp4', 'https://telegra.ph/file/2c1c68c9e310f60f1ded1.mp4', 
        'https://telegra.ph/file/e14f5a31d3b3c279f5593.mp4', 'https://telegra.ph/file/e020aa808f154a30b8da7.mp4', 
        'https://telegra.ph/file/1cafb3e72664af94d45c0.mp4', 'https://telegra.ph/file/72b49d3b554df64e377bb.mp4', 
        'https://telegra.ph/file/9687aedfd58a3110c7f88.mp4', 'https://telegra.ph/file/c799ea8a1ed0fd336579c.mp4', 
        'https://telegra.ph/file/7352d18934971201deed5.mp4', 'https://telegra.ph/file/379edd38bac6de4258843.mp4'
    ],
    sixnine: [
        'https://telegra.ph/file/bb4341187c893748f912b.mp4', 'https://telegra.ph/file/c7f154b0ce694449a53cc.mp4', 
        'https://telegra.ph/file/1101c595689f638881327.mp4', 'https://telegra.ph/file/f7f2a23e9c45a5d6bf2a1.mp4', 
        'https://telegra.ph/file/a2098292896fb05675250.mp4', 'https://telegra.ph/file/16f43effd7357e82c94d3.mp4', 
        'https://telegra.ph/file/55cb31314b168edd732f8.mp4', 'https://telegra.ph/file/1cbaa4a7a61f1ad18af01.mp4', 
        'https://telegra.ph/file/1083c19087f6997ec8095.mp4'
    ],
    cum: [
        'https://telegra.ph/file/9243544e7ab350ce747d7.mp4', 'https://telegra.ph/file/fadc180ae9c212e2bd3e1.mp4', 
        'https://telegra.ph/file/79a5a0042dd8c44754942.mp4', 'https://telegra.ph/file/035e84b8767a9f1ac070b.mp4', 
        'https://telegra.ph/file/0103144b636efcbdc069b.mp4', 'https://telegra.ph/file/4d97457142dff96a3f382.mp4', 
        'https://telegra.ph/file/b1b4c9f48eaae4a79ae0e.mp4', 'https://telegra.ph/file/5094ac53709aa11683a54.mp4', 
        'https://telegra.ph/file/5094ac53709aa11683a54.mp4', 'https://telegra.ph/file/dc279553e1ccfec6783f3.mp4', 
        'https://telegra.ph/file/acdb5c2703ee8390aaf33.mp4'
    ],
    grabboobs: [
        'https://telegra.ph/file/e6bf14b93dfe22c4972d0.mp4', 'https://telegra.ph/file/075db3ebba7126d2f0d95.mp4', 
        'https://telegra.ph/file/37c21753892b5d843b9ce.mp4', 'https://telegra.ph/file/04bbf490e29158f03e348.mp4', 
        'https://telegra.ph/file/82d32821f3b57b62359f2.mp4', 'https://telegra.ph/file/36149496affe5d02c8965.mp4', 
        'https://telegra.ph/file/61d85d10baf2e3b9a4cde.mp4', 'https://telegra.ph/file/538c95e4f1c481bcc3cce.mp4', 
        'https://telegra.ph/file/e999ef6e67a1a75a515d6.mp4', 'https://telegra.ph/file/05c1bd3a2ec54428ac2fc.mp4'
    ],
    spank: [
        'https://files.catbox.moe/yjulgu.mp4', 'https://telegra.ph/file/07fe0023525be2b2579f9.mp4', 
        'https://telegra.ph/file/f830f235f844e30d22e8e.mp4', 'https://telegra.ph/file/e278ca6dc7d26a2cfda46.mp4', 
        'https://files.catbox.moe/mf3tve.mp4', 'https://files.catbox.moe/hobfrw.mp4', 'https://files.catbox.moe/rzijb5.mp4'
    ],
    suckboobs: [
        'https://telegra.ph/file/01143878beb3d0430c33e.mp4', 'https://telegra.ph/file/7b181cbaa54eee6c048fc.mp4', 
        'https://telegra.ph/file/f8cf75586670483fadc1d.mp4', 'https://telegra.ph/file/f8969e557ad07e7e53f1a.mp4', 
        'https://telegra.ph/file/1104aa065e51d29a5fb4f.mp4', 'https://telegra.ph/file/9e1240c29f3a6a9867aaa.mp4', 
        'https://telegra.ph/file/949dff632250307033b2e.mp4', 'https://telegra.ph/file/b178b294a963d562bb449.mp4', 
        'https://telegra.ph/file/95efbd8837aa18f3e2bde.mp4', 'https://telegra.ph/file/9827c7270c9ceddb8d074.mp4'
    ],
    yuri: [
        'https://telegra.ph/file/d11af77009e15383a5f3e.mp4', 'https://telegra.ph/file/b24f36949398986232952.mp4',
        'https://telegra.ph/file/aae61f727baf48c0a25f8.mp4', 'https://telegra.ph/file/8baea377988065dd28520.mp4',
        'https://telegra.ph/file/553649d8f95f7ff86b9f2.mp4', 'https://telegra.ph/file/c3b386d99c84e7c914a6e.mp4',
        'https://telegra.ph/file/a438a1aec11241b8a63eb.mp4', 'https://telegra.ph/file/0c5a22faacbc91d4e93a5.mp4',
        'https://telegra.ph/file/d999becfa325549d1c976.mp4'
    ]
};
