let handler = async (m, { conn, isOwner, usedPrefix }) => {
    // 1. Obtener la configuración del chat
    let chat = global.db.data.chats[m.chat];
    
    // 2. Verificar la variable 'nsfw'
    if (!chat.nsfw) {
        // 3. Si la variable está desactivada, enviar un mensaje y terminar el comando
        m.reply(`⚠️ La opción *nsfw* está desactivada para este grupo.\n\nPara activarla, un administrador debe usar el comando:\n*${usedPrefix}on nsfw*`);
        return; // Esto detiene la ejecución del comando aquí
    }

    // 4. Si la variable está activada, ejecutar la función normal del comando
    // Aquí puedes poner el código de tu comando NSFW
    
    await conn.reply(m.chat, '🍑 ¡El contenido +18 está permitido aquí! Aquí está tu imagen NSFW.', m);

};

handler.help = ['pene'];
handler.tags = ['nsfw'];
handler.command = ['pene', 'fuck'];
handler.group = true;

export default handler;
