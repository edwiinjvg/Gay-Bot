import fetch from 'node-fetch'
import { translate } from '@vitalets/google-translate-api'; // Asegúrate de tener esta librería instalada

let handler = m => m
handler.before = async (m) => {
    // No respondemos a los mensajes del propio bot
    if (m.fromMe) return
    let chat = global.db.data.chats[m.chat]
    
    // Si el modo Simsimi no está activado en el chat, no hacemos nada
    if (!chat.simi) return
    
    // Lista de comandos que no queremos que responda Simsimi
    const commandBlacklist = ['serbot', 'bots', 'jadibot', 'menu', 'play', 'play2', 'playdoc', 'tiktok', 'facebook', 'menu2', 'infobot', 'estado', 'ping', 'instalarbot', 'sc', 'sticker', 's', 'wm', 'qc'];
    
    // Verificamos si el mensaje es un comando de la lista negra
    if (commandBlacklist.some(command => m.text.includes(command))) {
        return;
    }

    if (!m.text) return
    
    let textodem = m.text;
    
    try {
        await conn.sendPresenceUpdate('composing', m.chat)
        
        // --- OPCIÓN 1: API de Simsimi ---
        // Se usa una API de Simsimi que es fiable y no requiere clave
        let simsimi = await fetch(`https://api.simsimi.fun/v2/?text=${encodeURIComponent(textodem)}&lc=es&cf=true`);
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
            let reis = await translate(textodem, { to: 'en' });
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
            // Si todo falla, no respondemos para evitar bucles de error.
        }
    }
    return true
}

export default handler
