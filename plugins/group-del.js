conts handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si el comando fue usado respondiendo a un mensaje
    if (!m.quoted) {
        return conn.reply(m.chat, '_Responde a un mensaje para borrarlo._', m);
    }
    
    // Obtener la clave del mensaje que se va a borrar
    const messageKey = m.quoted.key;

    try {
        await conn.sendMessage(m.chat, { delete: messageKey });
        // No enviamos un mensaje de confirmación, el borrado es la confirmación visual.
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar borrar el mensaje. Por favor, revisa si tengo los permisos necesarios._', m);
    }
};

handler.help = ['delete', 'del'];
handler.tags = ['admin'];
handler.command = ['delete', 'del', 'borrar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
