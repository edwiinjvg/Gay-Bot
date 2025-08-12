let handler = async (m, { conn, args, groupMetadata, isOwner, isAdmin, isBotAdmin }) => {
    // Identificar al usuario a desmutear
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('_Número inválido_');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('_Menciona o responde a un usuario para desmutearlo._');
    }
    
    // --- Lógica de protecciones modificada ---
    if (user === m.sender) {
        // Permitir que un admin se desmutee a sí mismo
        if (!isAdmin) {
            return m.reply('_Solo los administradores pueden desmutearse a sí mismos._');
        }
    }
    
    // Permitir que el bot se desmutee a sí mismo
    if (user === conn.user.jid) {
      // No hay mensaje de error, simplemente procedemos a la acción.
    }
    // --- Fin de la lógica de protecciones ---
    
    const userTarget = global.db.data.users[user];

    // Verificar si el usuario está silenciado
    if (!userTarget || !userTarget.muto) {
        return m.reply(`_¡*@${user.split('@')[0]}* no está silenciado!_`, null, { mentions: [user] });
    }

    // Desmutear al usuario
    userTarget.muto = false;
    await m.reply(`_¡@${user.split('@')[0]} desmuteado con éxito!_`, null, { mentions: [user] });
};

handler.help = ['unmute @usuario'];
handler.tags = ['group'];
handler.command = ['unmute', 'desmutear'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
