var handler = async (m, { conn, args }) => {
    const groupMetadata = await conn.groupMetadata(m.chat);

    // Identificación del usuario a expulsar
    let memberToRemoveId = null;

    if (m.mentionedJid && m.mentionedJid[0]) {
        memberToRemoveId = m.mentionedJid[0];
    } else if (m.quoted) {
        memberToRemoveId = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('_Número inválido._');
        memberToRemoveId = number + '@s.whatsapp.net';
    } else {
        return m.reply('_Menciona, responde o escribe un número para expulsar._');
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

    // Verificar si el usuario a expulsar es admin del grupo
    const isTargetAdmin = groupMetadata.participants.some(p => p.id === memberToRemoveId && (p.admin === 'admin' || p.admin === 'superadmin'));
    if (isTargetAdmin) {
      return m.reply("_¡No puedes eliminar a un administrador!_");
    }

    // Ejecución del comando
    try {
        await conn.groupParticipantsUpdate(m.chat, [memberToRemoveId], 'remove');
        await conn.sendMessage(m.chat, { text: '_¡Un imbécil fue eliminado con éxito!_ 🔥' });
    } catch (e) {
        await m.reply(`_No pude expulsar al usuario. Puede que no tenga permisos._`);
    }
};

handler.help = ['ban', 'kick'];
handler.tags = ['group'];
handler.command = ['ban', 'kick'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
