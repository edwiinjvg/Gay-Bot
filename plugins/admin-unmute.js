// Archivo: grupo-unmute.js

let handler = async (m, { conn, args, groupMetadata, isOwner, isAdmin, isBotAdmin }) => {
    // Verificar si es un grupo
    if (!m.isGroup) {
        return m.reply('_Este comando solo puede ser utilizado en grupos._');
    }
    
    // Verificar si el que usa el comando es admin
    if (!isAdmin) {
        return m.reply('_¡Solo administradores pueden utilizar este comando!_');
    }

    // Verificar si el bot es admin
    if (!isBotAdmin) {
        return m.reply('_¡Necesito ser administrador para poder ejecutar este comando!_');
    }
    
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
    
    // Protecciones
    if (user === m.sender) {
        return m.reply('¿A ti mismo?');
    }
    if (user === conn.user.jid) {
        return m.reply('_¡No puedo desmutearme a mí mismo!_');
    }
    
    const userTarget = global.db.data.users[user];

    // Verificar si el usuario está silenciado
    if (!userTarget || !userTarget.muto) {
        return m.reply(`_¡*@${user.split('@')[0]}* no está silenciado!_`, null, { mentions: [user] });
    }

    // Desmutear al usuario
    userTarget.muto = false;
    await m.reply(`_¡*@${user.split('@')[0]}* desmuteado con éxito!_`, null, { mentions: [user] });
};

handler.help = ['unmute @usuario'];
handler.tags = ['group'];
handler.command = ['unmute', 'desmutear'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
