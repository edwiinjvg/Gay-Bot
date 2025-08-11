import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mediaPath = path.join(__dirname, '..', 'storage', 'actions');

const handler = async (m, { conn, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        return m.reply('_Este comando solo puede ser utilizado en grupos._');
    }

    if (!who) {
        return m.reply(`_Menciona a un usuario o responde a un mensaje para usar *${usedPrefix + command}*._`);
    }

    let sender = m.sender.replace(/@.+/, '');
    let target = who.replace(/@.+/, '');
    const mentions = [m.sender, who];

    if (['abrazar', 'abrazo', 'abrazos', 'hug'].includes(command)) {
        const gifPath = path.join(mediaPath, 'hug-darker-than-black.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*@${sender}* *le dió un fuerte abrazo a* *@${target}* 🫂`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }

    else if (['besar', 'besa', 'beso', 'kiss'].includes(command)) {
        const gifPath = path.join(mediaPath, 'kiss.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*@${sender}* *besó de lengua a* *@${target}* 👅`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }
    
    else if (['bofetada', 'bofetear', 'bofetadas'].includes(command)) {
        const gifPath = path.join(mediaPath, 'slap-jjk.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*@${sender}* *le dió una bofetada a* *@${target}*`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }
    
    else if (['golpear', 'golpe', 'puñetazo', 'puñetazazo', 'puño'].includes(command)) {
        const gifPath = path.join(mediaPath, 'some-guy-getting-punch-anime-punching-some-guy-anime.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*¡@${sender}* *le reventó la cara a* *@${target}!* 👊`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }
    
    else if (['luchar', 'pelea'].includes(command)) {
        const gifPath = path.join(mediaPath, 'sung-jin-woo-jinwoo.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*¡@${sender}* *tuvo una pelea intensa con* *@${target}!* 🤺`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }
    
    else if (['matar', 'mata', 'kill'].includes(command)) {
        const gifPath = path.join(mediaPath, 'yumeko-mirai-nikki.mp4');
        await conn.sendMessage(m.chat, {
            video: { url: gifPath },
            caption: `*¡@${sender}* *mató brutalmente a* *@${target}!* 💀`,
            gifPlayback: true,
            mentions
        }, { quoted: m });
    }
};

handler.help = [
    'abrazar', 'abrazo', 'abrazos', 'hug',
    'besar', 'besa', 'beso', 'kiss',
    'bofetada', 'bofetear', 'bofetadas',
    'golpear', 'golpe', 'puñetazo', 'puñetazazo', 'puño',
    'luchar', 'pelea',
    'matar', 'mata', 'kill'
];
handler.tags = ['reactions'];
handler.command = [
    'abrazar', 'abrazo', 'abrazos', 'hug',
    'besar', 'besa', 'beso', 'kiss',
    'bofetada', 'bofetear', 'bofetadas',
    'golpear', 'golpe', 'puñetazo', 'puñetazazo', 'puño',
    'luchar', 'pelea',
    'matar', 'mata', 'kill'
];
handler.group = true;

export default handler;
