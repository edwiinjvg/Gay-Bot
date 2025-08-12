var handler = async (m, { conn, text, command }) => {
    // Lógica para encontrar al usuario
    let memberToUnwarn = null;

    if (m.quoted) {
        memberToUnwarn = m.quoted.sender;
    } else if (text) {
        const mentionedUser = m.mentionedJid[0];
        if (mentionedUser) {
            memberToUnwarn = mentionedUser;
        }
    }

    // Si no se encuentra un usuario, pedirle al admin que lo mencione
    if (!memberToUnwarn) {
        return conn.reply(m.chat, `_Menciona o responde al mensaje de un usuario para quitarle una advertencia._`, m);
    }
    
    let user = global.db.data.users[memberToUnwarn];

    if (!user) {
        return conn.reply(m.chat, `_El usuario no se encuentra en mi base de datos._`, m);
    }

    // Verificar si el usuario tiene advertencias
    if (!user.warn || user.warn <= 0) {
        return conn.reply(m.chat, `_@${memberToUnwarn.split('@')[0]} no tiene ninguna advertencia._`, m, { mentions: [memberToUnwarn] });
    }

    // Reducir advertencia
    user.warn -= 1;
    let newWarnCount = user.warn;
    let maxWarns = 3;

    // Mensaje de confirmación
    await conn.reply(m.chat, `
- _Se retiró una advertencia a @${memberToUnwarn.split('@')[0]}._\n- _*Advertencias actuales:* ${newWarnCount}/${maxWarns}_`, m, { mentions: [memberToUnwarn] });
};

handler.help = ['unwarn @usuario', 'quitarwarn @usuario'];
handler.tags = ['group'];
handler.command = ['unwarn', 'quitaradvertencia'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
