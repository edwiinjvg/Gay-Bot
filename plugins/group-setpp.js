var handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si se está respondiendo a una imagen
    if (!m.quoted || !m.quoted.mimetype.startsWith('image/')) {
        return conn.reply(m.chat, `_Responde a una imagen con este comando para cambiar la foto del grupo, por ejemplo: ${usedPrefix + command}_`, m);
    }
    
    try {
        // Descargar la imagen a la que se respondió
        const media = await m.quoted.download();
        
        // Usar la imagen descargada para actualizar la foto de perfil del grupo
        await conn.updateProfilePicture(m.chat, media);
        
        await conn.reply(m.chat, `_¡La foto de perfil del grupo ha sido cambiada con éxito!_`, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al cambiar la foto. Asegúrate de que el bot sea administrador y de que la imagen sea válida._', m);
    }
};

handler.help = ['setpp'];
handler.tags = ['group'];
handler.command = ['setpp', 'setprofilepic'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
