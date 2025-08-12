import { fileURLToPath } from 'url';
import path from 'path';

const emojis = ['🍒', '🍑', '🍆', '🔥', '👑', '💫', '🌟', '✨', '💋', '😈', '🥵', '💦'];

const handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!m.isGroup) {
        return m.reply('_Este comando solo se puede utilizar en grupos._');
    }

    const participants = m.isGroup ? await conn.groupFetchParticipants(m.chat) : [];
    
    if (!Array.isArray(participants) || participants.length === 0) {
        return m.reply('_Este grupo no tiene participantes._');
    }

    const topText = args.join(' ');
    if (!topText) {
        return m.reply(`_Escribe un texto para tu top. Ejemplo: *${usedPrefix + command} los más hermosos*_`);
    }

    let top10Participants = [];
    
    // Si hay menos de 10 participantes, se repiten aleatoriamente para completar la lista
    if (participants.length < 10) {
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * participants.length);
            top10Participants.push(participants[randomIndex]);
        }
    } else {
        // Si hay 10 o más, se eligen 10 de forma aleatoria sin repetir
        const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
        top10Participants = shuffledParticipants.slice(0, 10);
    }
    
    let topListText = ` - 「 *_TOP 10 ${topText.toUpperCase()}_ 」*\n\n`;
    let mentions = [];
    
    for (let i = 0; i < top10Participants.length; i++) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const participantJid = top10Participants[i].id;
        const participantNumber = participantJid.split('@')[0];
        
        mentions.push(participantJid);
        
        topListText += `  - *_${i + 1}._* ${randomEmoji} _*@${participantNumber}*_ ${randomEmoji}\n`;
    }

    await conn.sendMessage(m.chat, { text: topListText, mentions: mentions }, { quoted: m });
};

handler.help = ['top <texto>'];
handler.tags = ['diversion'];
handler.command = ['top', 'top10'];
handler.group = true;

export default handler;
