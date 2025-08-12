const handler = async (m, { conn, usedPrefix, command, text }) => {
    // --- Lógica para encontrar al usuario ---
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

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        await conn.reply(m.chat, `_¡@${number} ha sido promovido a administrador!_`, m, { mentions: [user] });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `_¡Oops! No pude procesar a esa persona._`, m);
    }
};

handler.help = ['promote @user', 'admin @user'];
handler.tags = ['admin'];
handler.command = ['promote', 'admin'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
