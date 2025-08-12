var handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si se está respondiendo a un mensaje
    if (!m.quoted) {
        return conn.reply(m.chat, `_Responde al mensaje que quieres fijar._`, m);
    }
    
    try {
        // Fijar el mensaje al que se respondió
        await conn.sendMessage(m.chat, { 
            text: '_¡Mensaje fijado con éxito!_', 
            pin: true 
        }, { 
            quoted: m.quoted 
        });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar fijar el mensaje._', m);
    }
};

handler.help = ['pin', 'fijar'];
handler.tags = ['group'];
handler.command = ['fijar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
