var handler = async (m, { conn, text, command }) => {
    // Lógica para encontrar al usuario
    let memberToWarn = null;

    if (m.quoted) {
        memberToWarn = m.quoted.sender;
    } else if (text) {
        const mentionedUser = m.mentionedJid[0];
        if (mentionedUser) {
            memberToWarn = mentionedUser;
        }
    }

    // Si no se encuentra un usuario, pedirle al admin que lo mencione
    if (!memberToWarn) {
        return conn.reply(m.chat, `_Menciona o responde al mensaje de un usuario para advertirlo._`, m);
    }
    
    // Separar la razón del mensaje del usuario
    let reason = text.replace(/@\d+/g, '').trim();
    if (m.quoted && m.quoted.sender === memberToWarn) {
        reason = text;
    }

    // Si no se da una razón, se establece como "Sin especificar"
    if (!reason) {
        reason = "sin especificar";
    }

    // --- Protecciones añadidas ---
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    if (memberToWarn === m.sender) {
        return conn.reply(m.chat, `_¡No puedes advertirte a ti mismo!_`, m);
    }
    if (memberToWarn === ownerBot) {
        return conn.reply(m.chat, `_¡No puedes advertir a mi dueño!_`, m);
    }
    // --- Fin de protecciones ---

    let user = global.db.data.users[memberToWarn];

    if (!user) {
        return conn.reply(m.chat, `_El usuario no se encuentra en mi base de datos._`, m);
    }

    // Incrementar advertencia
    user.warn = (user.warn || 0) + 1;
    let newWarnCount = user.warn;
    let maxWarns = 3;

    // Mensaje de advertencia incluyendo la razón
    await conn.reply(m.chat, `
- _¡*@${memberToWarn.split('@')[0]}* ha sido advertido!_\n- _*Razón:* ${reason}_\n- _*Advertencias:* ${newWarnCount}/${maxWarns}_\n_Si alcanzas 3 advertencias, serás expulsado del grupo._`, m, { mentions: [memberToWarn] });

    // Si las advertencias alcanzan el límite, expulsar al usuario
    if (newWarnCount >= maxWarns) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [memberToWarn], 'remove');
            await conn.reply(m.chat, `_¡*@${memberToWarn.split('@')[0]}* alcanzó el máximo de *${maxWarns}* advertencias y ha sido expulsado!_`, m, { mentions: [memberToWarn] });
            user.warn = 0; // Reiniciar advertencias después de ser expulsado
        } catch (e) {
            console.error(e);
            await conn.reply(m.chat, `_Ocurrió un error al intentar expulsar al usuario._`, m);
        }
    }
};

handler.help = ['warn @usuario', 'advertir @usuario'];
handler.tags = ['group'];
handler.command = ['warn', 'advertir'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
