import fetch from 'node-fetch'

const defaultImage = 'https://files.catbox.moe/ubftco.jpg'

const handler = async (m, { conn, usedPrefix, text, isAdmin, isOwner, command }) => {
    if (!m.isGroup) return m.reply('_¡Este comando solo puede ser utilizado en grupos!_');
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    const chat = global.db.data.chats[m.chat];
    
    if (!(isAdmin || isOwner)) {
        return m.reply('_Solo los administradores pueden personalizar los mensajes de bienvenida y despedida._');
    }

    const type = command.toLowerCase();
    
    // Obtener el mensaje que el usuario quiere guardar
    const message = text.trim();
    if (!message) {
        return m.reply(`_Escribe el mensaje que quieres guardar._\n_Puedes usar @user para mencionar al usuario y @group para mencionar el nombre del grupo._`);
    }

    if (type === 'setwelcome') {
        chat.welcomeMessage = message;
        m.reply('_El mensaje de bienvenida se ha guardado correctamente._');
    } else if (type === 'setbye') {
        chat.byeMessage = message;
        m.reply('_El mensaje de despedida se ha guardado correctamente._');
    }
};

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return;
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    const chat = global.db.data.chats[m.chat];
    
    // Solo si el mensaje de bienvenida/salida está activado
    if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupSize = groupMetadata.participants.length;
        const userId = m.messageStubParameters?.[0] || m.sender;
        const userMention = `@${userId.split('@')[0]}`;
        const groupName = groupMetadata.subject;
        let profilePic;

        try {
            profilePic = await conn.profilePictureUrl(userId, 'image');
        } catch {
            profilePic = defaultImage;
        }

        if (m.messageStubType === 27) {
            const welcomeText = chat.welcomeMessage ? 
                chat.welcomeMessage.replace('@user', userMention).replace('@group', groupName) : 
                `
- _¡Bienvenido a *${groupName}* *${userMention}*!_\n- _Ahora somos *${groupSize}*_.`.trim();

            await conn.sendMessage(m.chat, {
                image: { url: profilePic },
                caption: welcomeText,
                contextInfo: { mentionedJid: [userId] }
            });
        }

        if (m.messageStubType === 28 || m.messageStubType === 32) {
            const byeText = chat.byeMessage ?
                chat.byeMessage.replace('@user', userMention).replace('@group', groupName) :
                `
- _Se fue el perdedor de *${userMention}*, ojalá no vuelva nunca_.\n- _Aún quedamos *${groupSize}* ganadores._`.trim();

            await conn.sendMessage(m.chat, {
                image: { url: profilePic },
                caption: byeText,
                contextInfo: { mentionedJid: [userId] }
            });
        }
    }
};

handler.command = ['setwelcome', 'setbye'];
handler.group = true;
handler.admin = true;
handler.register = true;
handler.tags = ['group'];
handler.help = ['setwelcome', 'setbye'];

export default handler;
