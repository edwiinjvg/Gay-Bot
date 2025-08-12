import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`_¿Qué quieres que le diga a Simsimi?_ 😼\n_Usa el comando así: *${usedPrefix + command} hola bot*_`);
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // --- USANDO LA API DE SIMSIMI QUE PROPORCIONASTE ---
        // Se corrigió el idioma a español (lc=es). El UUID podría ser temporal.
        const response = await fetch(`http://www.simsimi.com/getRealtimeReq?uuid=wcuvljWyNZp501RVwi7dtdrHrhTw8iBZVuTCCU5bV1w&lc=es&ft=1&reqText=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error(`Error en la API de Simsimi: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.respSentence) {
            await m.reply(data.respSentence);
        } else {
            await m.reply('_Lo siento, Simsimi no pudo responder en este momento._');
        }

    } catch (e) {
        console.error('Error al comunicarse con la API de Simsimi:', e);
        await m.reply('_Ocurrió un error inesperado al comunicarme con el bot. Es posible que la API esté caída._');
    }
};

handler.help = ['simi <texto>'];
handler.tags = ['diversion'];
handler.command = ['simi'];

export default handler;
