let handler = async (m, { conn, args, usedPrefix, command, groupMetadata, isOwner, isAdmin, isBotAdmin }) => {
    // Identificar al usuario a silenciar
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('_Número inválido._');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('_Menciona o responde a un usuario para silenciarlo._');
    }

    // Protecciones
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    const userTarget = global.db.data.users[user];

    if (user === m.sender) {
      return m.reply("_¡No puedes silenciarte a ti mismo!_");
    }
    if (user === ownerGroup) {
      return m.reply("_¡No puedes silenciar al dueño del grupo!_");
    }
    if (user === ownerBot) {
      return m.reply("_¡No puedes silenciar a mi dueño!_");
    }
    if (user === conn.user.jid) {
      return m.reply("_¡No puedes silenciarme!_");
    }

    // Verificar si el usuario a silenciar es admin del grupo
    const isTargetAdmin = groupMetadata.participants.some(p => p.id === user && (p.admin === 'admin' || p.admin === 'superadmin'));
    if (isTargetAdmin) {
      return m.reply("_No puedes silenciar a un administrador._");
    }

    // Verificar si el usuario ya está silenciado
    if (userTarget && userTarget.muto) {
      return m.reply(`_@${user.split('@')[0]} ya está silenciado en este grupo._`, null, { mentions: [user] });
    }

    // Silenciar al usuario
    if (userTarget) {
      userTarget.muto = true;
      await m.reply(`_¡@${user.split('@')[0]} fue silenciado con éxito en este grupo!_`, null, { mentions: [user] });
    } else {
      await m.reply(`_El usuario @${user.split('@')[0]} no existe en la base de datos. No se puede silenciar._`, null, { mentions: [user] });
    }
};

handler.help = ['mute @usuario'];
handler.tags = ['group'];
handler.command = ['mute', 'mutar', 'silenciar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
