import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch'; // Asegúrate de que esta librería esté instalada: npm install node-fetch

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`_Escribe algo para hablar con el bot._`);
    }

    try {
        const encodedText = encodeURIComponent(text);
        
        // --- NUEVA API DE SIMSIMI ---
        const response = await fetch(`https://simsimi.info/api/?text=${encodedText}&lc=es`);
        
        if (!response.ok) {
            throw new Error(`Error en la API de Simsimi: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.message) {
            return m.reply(data.message);
        } else {
            return m.reply('_Lo siento, Simsimi no pudo responder en este momento._');
        }

    } catch (error) {
        console.error('Error al llamar a la API de Simsimi:', error);
        return m.reply('_Ocurrió un error inesperado al comunicarme con Simsimi._');
    }
};

handler.help = ['simsimi <texto>', 'simi <texto>'];
handler.tags = ['diversion'];
handler.command = ['simsimi', 'simi'];

export default handler;
