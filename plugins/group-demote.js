var handler = async (m, { conn, usedPrefix, command, text }) => {
    // --- Lógica para encontrar al usuario (igual que en el comando promote) ---
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
    if (number.length > 15 || number.length < 9) {
        return conn.reply(m.chat, `_El número de teléfono no es válido._`, m);
    }
    let user = number + '@s.whatsapp.net';
    // --- Fin de la lógica para encontrar al usuario ---
    
    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        await conn.reply(m.chat, `_¡@${number} ha sido degradado a miembro!_`, m, { mentions: [user] });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `_Ocurrió un error al intentar degradar al usuario. ¿El bot es administrador?_`, m);
    }
};

handler.help = ['demote'];
handler.tags = ['grupo'];
handler.command = ['demote','unadmin', 'degradar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
