// Archivo: grupo-demote.js

let handler = async (m, { conn, args, usedPrefix, command, groupMetadata, isOwner, isAdmin, isBotAdmin }) => {
    // Verificar si es un grupo
    if (!m.isGroup) {
        return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    }

    // Verificar si el que usa el comando es admin
    if (!isAdmin) {
        return m.reply('❌ Solo los admins pueden usar este comando.');
    }
    
    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return m.reply('❌ Debo ser admin del grupo para usar este comando.');
    }
    
    // Identificar al usuario a degradar
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ Número inválido.');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('_Etiquete a un administrador para degradarlo._');
    }
    
    // Obtener info del usuario objetivo para verificar si es admin
    const userTarget = groupMetadata.participants.find(p => p.id === user);

    // Protecciones
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) return m.reply(`😂 Calma no me puedo sacar yo mismo`);
    if (user === ownerGroup) return m.reply(`Ese es el dueño del grupo, no lo degradaré`);
    if (user === ownerBot) return m.reply(`Que piensas? ¿que degradaré al dueño del bot?`);
    if (user === m.sender) return m.reply(`¿A ti mismo?`)

    // Verificar si el usuario a degradar es admin
    if (!userTarget || (userTarget.admin !== 'admin' && userTarget.admin !== 'superadmin')) {
        return m.reply('_El usuario mencionado no es administrador._');
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        await m.reply('_¡Administrador degradado con éxito!_');
    } catch (e) {
        console.error(e);
        await m.reply('_¡Necesito ser administrador del grupo para degradar a otros administradores!_');
    }
};

handler.help = ['demote @usuario'];
handler.tags = ['group'];
handler.command = ['demote', 'deladmin'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
