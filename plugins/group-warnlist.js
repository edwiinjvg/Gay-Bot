var handler = async (m, { conn, participants, usedPrefix, command }) => {
    let warnList = [];
    const maxWarns = 3;
    
    // Recorrer todos los participantes del grupo
    for (let user of participants) {
        let userDb = global.db.data.users[user.id];
        // Si el usuario tiene advertencias, agregarlo a la lista
        if (userDb && userDb.warn > 0) {
            warnList.push({ user: user.id, warns: userDb.warn });
        }
    }

    // Si no hay usuarios con advertencias
    if (warnList.length === 0) {
        return conn.reply(m.chat, '_No hay usuarios con advertencias en este grupo._', m);
    }
    
    // Construir el mensaje con la lista de advertencias
    let message = `*[ ADVERTENCIAS DEL GRUPO ] ⚠️*\n\n`;
    for (let i = 0; i < warnList.length; i++) {
        let user = warnList[i].user;
        let warns = warnList[i].warns;
        message += `- _${i + 1}. @${user.split('@')[0]} - *${warns}/${maxWarns}*_\n`;
    }

    await conn.reply(m.chat, message, m, { mentions: warnList.map(item => item.user) });
};

handler.help = ['warnlist'];
handler.tags = ['group'];
handler.command = ['warnlist'];
handler.group = true;
handler.admin = true;

export default handler;
