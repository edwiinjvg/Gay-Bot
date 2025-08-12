import { fileURLToPath } from 'url';
import path from 'path';

const emojis = ['🍒', '🍑', '🍆', '🔥', '👑', '💫', '🌟', '✨', '💋', '😈', '🥵', '💦'];

const handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!m.isGroup) {
        return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    }

    // --- CORRECCIÓN AQUÍ ---
    const metadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
    const participants = metadata.participants;
    
    if (!Array.isArray(participants) || participants.length === 0) {
        return m.reply('_Este grupo no tiene participantes._');
    }

    const topText = args.join(' ');
    if (!topText) {
        return m.reply(`_Escribe un texto para tu top._`);
    }

    let top10Participants = [];
    
    if (participants.length < 10) {
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * participants.length);
            top10Participants.push(participants[randomIndex]);
        }
    } else {
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
