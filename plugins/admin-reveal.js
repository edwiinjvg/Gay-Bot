// Archivo: general-reveal.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si se respondió a una imagen o video
    if (!m.quoted) {
        return m.reply('_¡Necesitas responder a una imagen o video para revelarlo!_');
    }
    
    // Identificar el tipo de mensaje
    const isImage = m.quoted.mtype === 'imageMessage';
    const isVideo = m.quoted.mtype === 'videoMessage';

    if (!isImage && !isVideo) {
        return m.reply('_¡Necesitas responder a una imagen o video para revelarlo!_');
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let mediaCaption = `_¡Aquí está tu ${isImage ? "imagen revelada" : "video revelado"}!_`;
    
    const inputPath = path.join(global.__dirname(import.meta.url), 'tmp', `input-${m.sender.split('@')[0]}.${isImage ? 'jpg' : 'mp4'}`);
    const outputPath = path.join(global.__dirname(import.meta.url), 'tmp', `output-${m.sender.split('@')[0]}.${isImage ? 'jpg' : 'mp4'}`);

    try {
        // Descargar el medio
        const buffer = await conn.downloadMediaMessage(m.quoted);
        fs.writeFileSync(inputPath, buffer);

        // Procesar con ffmpeg
        await new Promise((resolve, reject) => {
            let proc = ffmpeg(inputPath);
            if (isImage) {
                proc.outputOptions("-q:v 2");
            } else {
                proc.outputOptions("-c copy");
            }
            proc.on("end", () => {
                resolve();
            })
            .on("error", (err) => {
                console.error("Error FFmpeg:", err);
                reject(err);
            })
            .save(outputPath);
        });

        // Enviar el medio procesado
        if (isImage) {
            await conn.sendMessage(m.chat, { image: fs.readFileSync(outputPath), caption: mediaCaption });
        } else {
            await conn.sendMessage(m.chat, { video: fs.readFileSync(outputPath), caption: mediaCaption });
        }
        
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (error) {
        console.error("Error general:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await m.reply("_Ocurrió un error al procesar el medio. Inténtalo de nuevo._");
    } finally {
        // Limpiar archivos temporales
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
};

handler.help = ['reveal', 'rv'];
handler.tags = ['general'];
handler.command = ['reveal', 'rv'];

export default handler;
