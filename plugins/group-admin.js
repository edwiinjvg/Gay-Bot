const handler = async (m, { conn, usedPrefix, command, participants, isBotAdmin, isAdmin }) => {
    if (!m.isGroup) {
        return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    }

    if (!isAdmin) {
        return m.reply('_¡Solo los administradores pueden utilizar este comando!_');
    }

    if (!isBotAdmin) {
        return m.reply('_¡Necesito ser administrador para poder ejecutar este comando!_');
    }

    let users = m.mentionedJid[0] ? [m.mentionedJid[0]] : m.quoted ? [m.quoted.sender] : [];

    if (users.length === 0) {
        let action = command === 'promote' || command === 'admin' ? 'promover' : 'degradar';
        return m.reply(`_Menciona a la persona o responde a su mensaje para ${action}la.`);
    }

    let action = command === 'promote' || command === 'admin' ? 'promote' : 'demote';
    let actionText = command === 'promote' || command === 'admin' ? 'promovido a administrador' : 'degradado a miembro';

    try {
        await conn.groupParticipantsUpdate(m.chat, users, action);
        await m.reply(`_¡@${users[0].split('@')[0]} ha sido ${actionText}!_`, { mentions: users });
    } catch (e) {
        console.error(e);
        await m.reply(`_Hubo un error al intentar ${action} al usuario._`);
    }
};

handler.help = ['promote @user', 'demote @user'];
handler.tags = ['admin'];
handler.command = ['promote', 'admin', 'demote', 'unadmin'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
