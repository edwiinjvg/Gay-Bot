import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api'; // Asegúrate de tener esta librería instalada

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Si el usuario no escribe nada después del comando, le pedimos un texto.
    if (!text) {
        return m.reply(`_¿Qué quieres que le diga a Simsimi?_ 😼\n_Usa el comando así: *${usedPrefix + command} hola bot*_`);
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // --- OPCIÓN 1: API de Simsimi ---
        // Se usa una API de Simsimi que es fiable y no requiere clave
        let simsimi = await fetch(`https://api.simsimi.fun/v2/?text=${encodeURIComponent(text)}&lc=es&cf=true`);
        let res = await simsimi.json();
        
        // Verificamos si la respuesta es válida
        if (res.success && res.message) {
            await m.reply(res.message);
            return true;
        }

    } catch (e) {
        console.error('Error al usar la API de Simsimi, usando fallback:', e);

        // --- OPCIÓN 2: Fallback con Brainshop (IA avanzada) ---
        // Este sistema de IA recuerda conversaciones
        try {
            // Traducimos el texto a inglés para la API de Brainshop
            let reis = await translate(text, { to: 'en' });
            let nombre = m.pushName || 'Usuario';
            
            // Hacemos la llamada a la API de Brainshop
            let api = await fetch(`http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=${nombre}&msg=${encodeURIComponent(reis.text)}`);
            let res = await api.json();
            
            // Traducimos la respuesta de Brainshop de vuelta a español
            let reis2 = await translate(res.cnt, { to: 'es' });
            await m.reply(reis2.text);
            
            return true;

        } catch (e2) {
            console.error('Error en el fallback de Brainshop:', e2);
            // Si todo falla, no respondemos.
        }
    }
};

handler.help = ['simi <texto>'];
handler.tags = ['diversion'];
handler.command = ['simi'];

export default handler;
