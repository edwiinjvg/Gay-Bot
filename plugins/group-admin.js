const handler = async (m, { conn, usedPrefix, command, text }) => {
    // --- Lógica para encontrar al usuario (más robusta) ---
    let number;
    if (!text && !m.quoted) {
        return conn.reply(m.chat, `_Debes mencionar o responder a alguien para usar este comando._`, m);
    }
    if (isNaN(text)) {
        if (text.includes('@')) {
            number = text.split('@')[1];
        }
    } else {
        number = text;
    }
    if (!number && m.quoted) {
        number = m.quoted.sender.split('@')[0];
    }
    if (!number) {
        return conn.reply(m.chat, `_No encontré a nadie válido para procesar._`, m);
    }
    let user = number + '@s.whatsapp.net';
    // --- Fin de la lógica para encontrar al usuario ---

    // Definimos la acción según el comando
    let action;
    let actionText;

    if (['promote', 'admin'].includes(command)) {
        action = 'promote';
        actionText = 'promovido a administrador';
    } else if (['demote', 'unadmin'].includes(command)) {
        action = 'demote';
        actionText = 'degradado a miembro';
    } else {
        return; // Comando no reconocido
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], action);
        await conn.reply(m.chat, `_¡@${number} ha sido ${actionText}!_`, m, { mentions: [user] });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `_¡Oops! No pude procesar a esa persona._`, m);
    }
};

handler.help = ['promote @user', 'demote @user'];
handler.tags = ['admin'];
handler.command = ['promote', 'admin', 'demote', 'unadmin'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
