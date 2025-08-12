import { fileURLToPath } from 'url';
import path from 'path';

const handler = async (m, { conn, usedPrefix, command }) => {
    let who;
    // Lógica para determinar el usuario objetivo (mención, respuesta o tú mismo)
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }
    
    // Genera un número aleatorio entre 1 y 1000
    const porcentaje = Math.floor(Math.random() * 1000) + 1;

    let replyMessage;
    const mention = `@${who.split('@')[0]}`;
    
    // Lógica para generar el mensaje basado en el comando
    switch (command) {
        case "gay":
            if (who === m.sender) {
                replyMessage = `*_¡Eres ${porcentaje}% homosexual!_* 🏳️‍🌈`;
            } else {
                replyMessage = `*_${mention} es ${porcentaje}% homosexual._* 🏳️‍🌈`;
            }
            break;
        case "lesbiana":
            if (who === m.sender) {
                replyMessage = `*_¡Eres ${porcentaje}% lesbiana!_* 🏳️‍🌈`;
            } else {
                replyMessage = `*_${mention} es ${porcentaje}% lesbiana._* 🏳️‍🌈`;
            }
            break;
        case "imbecil":
            if (who === m.sender) {
                replyMessage = `*_¡Eres ${porcentaje}% imbécil!_* 😹`;
            } else {
                replyMessage = `*_${mention} es ${porcentaje}% imbécil._* 😹`;
            }
            break;
        case "gilipollas":
            if (who === m.sender) {
                replyMessage = `*_¡Eres ${porcentaje}% gilipollas!_* 👺`;
            } else {
                replyMessage = `*_${mention} es ${porcentaje}% gilipollas._* 👺`;
            }
            break;
        default:
            // Mensaje por defecto si el comando no se reconoce
            replyMessage = `*_¡El nivel de ${command} de ${mention} es ${porcentaje}%!_*`;
            break;
    }
    
    // Asume que la función addXP está definida en tu sistema de niveles
    // await addXP(users, m.sender, conn.sendMessage);

    await conn.sendMessage(m.chat, { text: replyMessage, mentions: [who] }, { quoted: m });
};

handler.help = ['gay', 'lesbiana', 'imbecil', 'gilipollas'];
handler.tags = ['diversion'];
handler.command = ['gay', 'lesbiana', 'imbecil', 'gilipollas'];

export default handler;
