const handler = async (m, { conn, args, usedPrefix, command }) => {
    // --- VERIFICACIÓN DE PROPIETARIO DEL BOT ---
    if (!m.isOwner) {
        return m.reply('_Este comando solo puede ser utilizado por el propietario del bot._');
    }

    // El primer argumento es la cantidad
    let cantidad = Number(args[0]);

    if (isNaN(cantidad) || cantidad <= 0) {
        return m.reply(`_Ingresa una cantidad válida._\n_Uso correcto: *${usedPrefix}${command} <cantidad> [@usuario]*`);
    }

    let targetUserJid;
    // Lógica para determinar el usuario objetivo
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUserJid = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        targetUserJid = m.quoted.sender;
    } else {
        targetUserJid = m.sender;
    }

    // Verificamos si el usuario objetivo existe en la base de datos
    const targetUser = global.db.data.users[targetUserJid];
    if (!targetUser) {
        return m.reply(`_El usuario *@${targetUserJid.split('@')[0]}* no existe en la base de datos._`, {
            contextInfo: { mentionedJid: [targetUserJid] }
        });
    }

    const cantidadBig = BigInt(cantidad);
    const targetMoneyBig = BigInt(targetUser.money || 0);

    // --- Lógica para el comando 'addmoney' ---
    if (command === 'addmoney' || command === 'am') {
        targetUser.money = (targetMoneyBig + cantidadBig).toString();

        if (targetUserJid === m.sender) {
            return m.reply(`_Añadiste *${cantidadBig}* monedas a tu cuenta._ 🪙\n_Tu nuevo saldo es de: *${targetUser.money}* monedas._ 💰`);
        } else {
            const replyMessage = `_Añadiste *${cantidadBig}* monedas a la cuenta de *@${targetUserJid.split('@')[0]}*._ 🪙\n_El nuevo saldo es de: *${targetUser.money}* monedas._ 💰`;
            await conn.reply(m.chat, replyMessage, m, {
                mentions: [targetUserJid]
            });
        }
    }

    // --- Lógica para el comando 'removemoney' ---
    if (command === 'removemoney' || command === 'rm') {
        if (targetMoneyBig < cantidadBig) {
            const replyMessage = `_El usuario *@${targetUserJid.split('@')[0]}* no tiene suficientes monedas para quitarle *${cantidadBig}*._ 🪙\n_Su saldo actual es de: *${targetMoneyBig}*._ 💰`;
            return conn.reply(m.chat, replyMessage, m, {
                mentions: [targetUserJid]
            });
        }
        
        targetUser.money = (targetMoneyBig - cantidadBig).toString();

        if (targetUserJid === m.sender) {
            return m.reply(`_Removiste *${cantidadBig}* monedas de tu cuenta._ 🪙\n_Tu nuevo saldo es de: *${targetUser.money}* monedas._ 💰`);
        } else {
            const replyMessage = `_Removiste *${cantidadBig}* monedas de la cuenta de *@${targetUserJid.split('@')[0]}*._ 🪙\n_El nuevo saldo es de: *${targetUser.money}* monedas._ 💰`;
            await conn.reply(m.chat, replyMessage, m, {
                mentions: [targetUserJid]
            });
        }
    }
};

handler.help = ['addmoney <cantidad> [@usuario]', 'am <cantidad> [@usuario]', 'removemoney <cantidad> [@usuario]', 'rm <cantidad> [@usuario]'];
handler.tags = ['propietario'];
handler.command = ['addmoney', 'am', 'removemoney', 'rm'];
handler.owner = true; // Agregamos esta propiedad para la verificación del handler principal

export default handler;
