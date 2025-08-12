var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `_Escribe una nueva descripción para el grupo._`, m);
    }
    
    try {
        await conn.groupUpdateDescription(m.chat, text);
        await conn.reply(m.chat, `_¡La descripción del grupo ha sido cambiada exitosamente!_`, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar cambiar la descripción._', m);
    }
};

handler.help = ['setdesc <nueva descripción>'];
handler.tags = ['group'];
handler.command = ['setdesc', 'setdescription'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
