import axios from 'axios';
import translate from '@vitalets/google-translate-api';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Si no hay texto, pedimos que el usuario escriba algo.
    if (!text) {
        return m.reply(`_Escribe algo para hablar con el bot. 😼_`);
    }

    try {
        const resSimi = await simiTalk(text);
        if (resSimi.status) {
            await conn.sendMessage(m.chat, { text: resSimi.resultado.simsimi }, { quoted: m });
        } else {
            throw new Error(resSimi.resultado.msg);
        }
    } catch (e) {
        console.error(e);
        return m.reply('_Ocurrió un error al intentar comunicarme con Simsimi._');
    }
};

// Función para comunicarse con las APIs de Simsimi con sistema de respaldo (fallback)
async function simiTalk(ask, apiKey = "iJ6FxuA9vxlvz5cKQCt3", language = "es") {
    // Si el texto está vacío, devolvemos un error.
    if (!ask) {
        return { status: false, resultado: { msg: "_¡Debes ingresar un texto para hablar con simsimi!_" }};
    }
    
    // --- Intento con la primera API ---
    try {
        const response1 = await axios.get(`https://delirius-apiofc.vercel.app/tools/simi?text=${encodeURIComponent(ask)}`);
        
        // La API puede responder en otro idioma, así que traducimos
        const trad1 = await translate(`${response1.data.data.message}`, {to: language, autoCorrect: true});
        
        return { status: true, resultado: { simsimi: trad1.text }};        
    } catch (e1) {
        // --- Si falla, intentamos con la segunda API como respaldo ---
        try {
            const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apiKey}&ask=${ask}&lc=${language}`);
            return { status: true, resultado: { simsimi: response2.data.message }};
        } catch (e2) {
            // Si ambas fallan, devolvemos un mensaje de error
            console.error(e2);
            return { status: false, resultado: { msg: "_Todas las APIs fallaron. Inténtalo de nuevo más tarde._" }};
        }
    }
}

handler.help = ['simi <texto>', 'bot <texto>'];
handler.tags = ['diversion'];
handler.command = ['simi', 'bot'];

export default handler;
