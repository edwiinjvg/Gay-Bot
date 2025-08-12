var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `_Escribe un nuevo nombre para el grupo._`, m);
    }
    
    try {
        await conn.groupUpdateSubject(m.chat, text);
        await conn.reply(m.chat, `_¡El nombre del grupo ha sido cambiado a *"${text}"* exitosamente!_`, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar cambiar el nombre._', m);
    }
};

handler.help = ['setsubject <nuevo nombre>'];
handler.tags = ['group'];
handler.command = ['setsubject', 'setname'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
