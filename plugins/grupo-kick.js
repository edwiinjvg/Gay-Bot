var handler = async (m, { conn, args }) => {
    // Verificación de grupo
    if (!m.isGroup) return m.reply('🔒 Este comando solo se usa en grupos.');

    const groupMetadata = await conn.groupMetadata(m.chat);

    // Obtener información del usuario que envía el comando
    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    const isUserAdmin = userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin';

    // Verificación de admin
    if (!isUserAdmin) {
        return m.reply('❌ Solo los admins pueden usar este comando.');
    }

    // Identificación del usuario a expulsar
    let memberToRemoveId = null;

    if (m.mentionedJid && m.mentionedJid[0]) {
        memberToRemoveId = m.mentionedJid[0];
    } else if (m.quoted) {
        memberToRemoveId = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ Número inválido.');
        memberToRemoveId = number + '@s.whatsapp.net';
    } else {
        return m.reply('🚫 Mencioná, respondé o escribí un número para expulsar.');
    }

    // Protecciones
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';

    if (memberToRemoveId === m.sender) {
        return m.reply('_¡No puedes eliminarte a ti mismo!_');
    }
    if (memberToRemoveId === ownerGroup) {
        return m.reply('_¡No puedes eliminar al dueño del grupo!_');
    }
    if (memberToRemoveId === ownerBot) {
        return m.reply('_¡No puedes eliminar al dueño del bot!_');
    }

    // Ejecución del comando
    try {
        await conn.groupParticipantsUpdate(m.chat, [memberToRemoveId], 'remove');
        await conn.sendMessage(m.chat, { text: '_¡Un imbécil fue eliminado con éxito!_ 🔥' });
    } catch (e) {
        await m.reply(`No pude expulsar al usuario. Puede que no tenga permisos.`);
    }
};

handler.help = ['ban', 'kick'];
handler.tags = ['group'];
handler.command = ['ban', 'kick'];
handler.group = true;
handler.admin = true;

export default handler;
