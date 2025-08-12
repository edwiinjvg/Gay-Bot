const handler = async (m, { conn, usedPrefix, command, participants, isBotAdmin, isAdmin }) => {
    // Si no es un grupo, o no eres admin, o el bot no es admin, salimos.
    if (!m.isGroup || !isAdmin || !isBotAdmin) {
        return;
    }

    let text = m.text.toLowerCase().trim();
    let action = '';

    // Verificamos si el mensaje coincide con los comandos
    if (text.startsWith('.promote') || text.startsWith('.admin')) {
        action = 'promote';
    } else if (text.startsWith('.demote') || text.startsWith('.unadmin')) {
        action = 'demote';
    } else {
        return; // Si no es un comando de admin/demote, salimos
    }
    
    // Obtenemos el usuario objetivo
    let users = m.mentionedJid[0] ? [m.mentionedJid[0]] : m.quoted ? [m.quoted.sender] : [];

    if (users.length === 0) {
        let actionText = action === 'promote' ? 'promover' : 'degradar';
        return m.reply(`_Menciona a la persona o responde a su mensaje para ${actionText}la._`);
    }

    let actionText = action === 'promote' ? 'promovido a administrador' : 'degradado a miembro';

    try {
        await conn.groupParticipantsUpdate(m.chat, users, action);
        await m.reply(`_¡@${users[0].split('@')[0]} ha sido ${actionText}!_`, { mentions: users });
    } catch (e) {
        console.error(e);
        await m.reply(`_Hubo un error al intentar ${action === 'promote' ? 'promover' : 'degradar'} al usuario._`);
    }
};

handler.help = ['promote @user', 'demote @user'];
handler.tags = ['admin'];
handler.command = ['promote', 'admin', 'demote', 'unadmin']; // Propiedad necesaria para la carga del plugin
handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.before = handler; // Con esto forzamos al bot a leer el comando de forma diferente.

export default handler;
