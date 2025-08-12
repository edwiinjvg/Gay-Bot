import { fileTypeFromBuffer } from 'file-type';
import axios from 'axios';
import fs from 'fs';
import { tmpdir } from 'os';

let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si se está respondiendo a una imagen
    if (!m.quoted || !m.quoted.mimetype.startsWith('image/')) {
        return conn.reply(m.chat, `_Responde a una imagen con el comando para obtener una URL._`, m);
    }
    
    try {
        await m.reply('_Subiendo imagen, por favor espera..._');
        
        // Descargar la imagen a la que se respondió
        const media = await m.quoted.download();
        
        // Determinar el tipo de archivo y extensión
        const fileType = await fileTypeFromBuffer(media);
        if (!fileType) {
            return conn.reply(m.chat, '_No se pudo determinar el tipo de archivo._', m);
        }

        // Subir la imagen a telegra.ph
        const response = await axios.post('https://telegra.ph/upload', media, {
            headers: {
                'Content-Type': fileType.mime
            }
        });
        
        // Extraer la URL
        const data = response.data;
        if (data && data[0] && data[0].src) {
            const imageUrl = 'https://telegra.ph' + data[0].src;
            await conn.reply(m.chat, `_¡Imagen subida con éxito!_\n\n*URL:* ${imageUrl}`, m);
        } else {
            await conn.reply(m.chat, '_Ocurrió un error al subir la imagen._', m);
        }
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al procesar la imagen. Inténtalo de nuevo más tarde._', m);
    }
};

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['tourl', 'telegraph'];

export default handler;
