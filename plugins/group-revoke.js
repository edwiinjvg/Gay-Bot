var handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Anular el enlace de invitación actual
        await conn.groupRevokeInvite(m.chat);
        
        // Obtener el nuevo enlace de invitación generado automáticamente
        const newLink = await conn.groupInviteCode(m.chat);
        
        await conn.reply(m.chat, `_¡El enlace de invitación del grupo ha sido reestablecido exitosamente!_`, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '_Ocurrió un error al intentar reestablecer el enlace._', m);
    }
};

handler.help = ['resetlink'];
handler.tags = ['group'];
handler.command = ['resetlink', 'revoke'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
