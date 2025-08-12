import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api'; // Asegúrate de tener esta librería instalada

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`_¿Qué quieres que le diga al bot?_ 😼\n_Usa el comando así: *${usedPrefix + command} hola bot*_`);
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // --- USANDO LA API DE BRAINSHOP ---
        // Traducimos el texto a inglés para la API de Brainshop
        let translatedText = (await translate(text, { to: 'en' })).text;
        let nombre = m.pushName || 'Usuario';
        
        // Hacemos la llamada a la API de Brainshop
        let api = await fetch(`http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=${nombre}&msg=${encodeURIComponent(translatedText)}`);
        let res = await api.json();
        
        // Verificamos si la respuesta contiene el texto que necesitamos.
        if (!res.cnt) {
            throw new Error('La API de Brainshop no devolvió una respuesta válida.');
        }

        // Traducimos la respuesta de Brainshop de vuelta a español
        let translatedResponse = (await translate(res.cnt, { to: 'es' })).text;
        await m.reply(translatedResponse);
            
        return true;

    } catch (e) {
        console.error('Error al comunicarse con la API de Brainshop:', e);
        // Enviamos un mensaje de error al chat para que el usuario sepa que algo falló
        await m.reply('_Ocurrió un error inesperado al comunicarme con el bot. Es posible que el servicio esté caído._');
    }
};

handler.help = ['simi <texto>'];
handler.tags = ['diversion'];
handler.command = ['simi'];

export default handler;
