var handler = async (m, { conn, usedPrefix, command }) => {
    // Si no se respondió a un mensaje, no se puede fijar nada
    if (!m.quoted) {
        return conn.reply(m.chat, `_Responde al mensaje que quieres ${command === 'jijoji' || command === 'fijar' ? 'fijar' : 'desfijar'}._`, m);
    }
    
    try {
        const quoted = m.quoted;
        
        if (command === 'jijoji' || command === 'fijar') {
            // Fijar el mensaje
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    type: 4, // 4 es el tipo de mensaje para "pin"
                    key: quoted.key // Pasamos la clave completa del mensaje
                }
            }, {});
            await conn.reply(m.chat, '_¡Mensaje fijado con éxito!_', m);
        } else if (command === 'unpin' || command === 'desfijar') {
            // Desfijar el mensaje
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    type: 5, // 5 es el tipo de mensaje para "unpin"
                    key: quoted.key // Pasamos la clave completa del mensaje
                }
            }, {});
            await conn.reply(m.chat, '_¡Mensaje desfijado con éxito!_', m);
        }

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error._', m);
    }
};

handler.help = ['pin', 'unpin'];
handler.tags = ['group'];
handler.command = ['jijoji', 'fijar', 'unpin', 'desfijar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
