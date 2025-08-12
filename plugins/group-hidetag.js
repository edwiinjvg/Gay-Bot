var handler = async (m, { conn, text, participants }) => {
    // Obtener la lista de todos los participantes del grupo
    const users = participants.map(u => u.id);

    // Obtener el mensaje a enviar, si el usuario no pone texto se enviará un mensaje vacío.
    let message = text ? text : '';

    try {
        await conn.sendMessage(m.chat, { text: message, mentions: users });
    } catch (e) {
        console.error(e);
        await m.reply('_Ocurrió un error al intentar etiquetar a todos los miembros._');
    }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = ['hidetag', 'ht'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
