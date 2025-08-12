var handler = async (m, { conn, usedPrefix, command }) => {
    // Si no se respondió a un mensaje, no se puede fijar nada
    if (!m.quoted) {
        return conn.reply(m.chat, `_Responde al mensaje que quieres ${command === 'pin' || command === 'fijar' ? 'fijar' : 'desfijar'} con este comando._`, m);
    }
    
    try {
        const quoted = m.quoted;
        
        if (command === 'pin' || command === 'fijar') {
            await conn.sendMessage(m.chat, {
                pin: true,
                quoted: quoted.key
            });
            await conn.reply(m.chat, '_Mensaje fijado con éxito._', m);
        } else if (command === 'unpin' || command === 'desfijar') {
             await conn.sendMessage(m.chat, {
                unpin: true,
                quoted: quoted.key
            });
            await conn.reply(m.chat, '_Mensaje desfijado con éxito._', m);
        }

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error. Asegúrate de que el bot sea administrador del grupo y que el mensaje que intentas modificar exista._', m);
    }
};

handler.help = ['pin', 'unpin'];
handler.tags = ['group'];
handler.command = ['pin', 'fijar', 'unpin', 'desfijar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
