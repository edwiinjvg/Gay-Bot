// Archivo: grupo-demote.js

let handler = async (m, { conn, args, usedPrefix, command, groupMetadata, isOwner, isAdmin, isBotAdmin }) => {
    // Verificar si es un grupo
    if (!m.isGroup) {
        return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    }

    // Verificar si el que usa el comando es admin
    if (!isAdmin) {
        return m.reply('_¡Este comando solo puede ser utilizado por administradores!_');
    }
    
    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return m.reply('_¡Necesito ser admin para poder ejecutar este comando!_');
    }
    
    // Identificar al usuario a degradar
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
        return m.reply('_Menciona o responde a un administrador para degradarlo._');
    }
    
    // Obtener info del usuario objetivo para verificar si es admin
    const userTarget = groupMetadata.participants.find(p => p.id === user);

    // Protecciones
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) return m.reply(`_No me quitaré admin a mí mismo._ 😹`);
    if (user === ownerGroup) return m.reply(`_No puedo quitarle admin al dueño del grupo._`);
    if (user === ownerBot) return m.reply(`_No puedo quitarle admin a mi dueño._`);
    if (user === m.sender) return m.reply(`_No puedes quitarte admin a ti mismo, imbécil._`)

    // Verificar si el usuario a degradar es admin
    if (!userTarget || (userTarget.admin !== 'admin' && userTarget.admin !== 'superadmin')) {
        return m.reply('_Este usuario no es administrador._');
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        await m.reply('_¡Administrador degradado con éxito!_');
    } catch (e) {
        console.error(e);
        await m.reply('_¡Necesito ser administrador del grupo para utilizar este comando!_');
    }
};

handler.help = ['demote @usuario'];
handler.tags = ['group'];
handler.command = ['demote', 'deladmin'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
