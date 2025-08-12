var handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Obtener el enlace de invitación del grupo
        const groupLink = await conn.groupInviteCode(m.chat);
        
        await conn.reply(m.chat, `- _Enlace de invitación del grupo:_\n- \`\`\`https://chat.whatsapp.com/${groupLink}\`\`\``, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar obtener el enlace._', m);
    }
};

handler.help = ['link', 'enlace'];
handler.tags = ['group'];
handler.command = ['link', 'enlace'];
handler.group = true;
handler.botAdmin = true;

export default handler;
