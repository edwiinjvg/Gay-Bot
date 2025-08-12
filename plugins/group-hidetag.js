var handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    // Si no se proporciona texto, el bot pedirá un mensaje
    if (!text) {
        return conn.reply(m.chat, `_Escribe un mensaje para etiquetar a todos._`, m);
    }

    // Obtener la lista de todos los participantes del grupo
    const users = participants.map(u => u.id);

    try {
        await conn.sendMessage(m.chat, { text: text, mentions: users }, { quoted: m });
    } catch (e) {
        console.error(e);
        await m.reply('_Ocurrió un error al intentar etiquetar a todos los miembros._');
    }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = ['hidetag', 'ht', 'tagall', 'all'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
