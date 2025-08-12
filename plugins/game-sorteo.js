import { fileURLToPath } from 'url';
import path from 'path';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Verificamos si el comando se está ejecutando en un grupo
    if (!m.isGroup) {
        return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    }

    // Extraemos el objeto a sortear del mensaje
    const objeto = args.join(' ').trim();

    if (!objeto) {
        return m.reply(`_Debes especificar el objeto a sortear._`);
    }

    // Obtenemos la metadata del grupo para conseguir la lista de participantes
    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    // Verificamos que haya participantes en el grupo
    if (participants.length === 0) {
        return m.reply('_No hay suficientes participantes en el grupo para realizar un sorteo._');
    }

    // Seleccionamos un participante aleatorio
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winnerJid = participants[randomIndex].id;
    
    const replyMessage = `_🎉 ¡Sorteo de *${objeto}*! 🎉_\n\n_El ganador es... ¡*@${winnerJid.split('@')[0]}*!_ 🏆`;

    await conn.sendMessage(m.chat, { text: replyMessage, mentions: [winnerJid] }, { quoted: m });
};

handler.help = ['sorteo <objeto>'];
handler.tags = ['diversion'];
handler.command = ['sorteo'];
handler.group = true;

export default handler;
