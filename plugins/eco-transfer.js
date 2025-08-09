const handler = async (m, { conn, args, usedPrefix, command }) => {
    
    // --- VERIFICACIÓN DE REGISTRO AL INICIO DEL COMANDO ---
    const user = global.db.data.users[m.sender];
    if (!user || !user.registered) {
        return m.reply('_Debes estar registrado para poder usar este comando._');
    }

    // --- Lógica para el comando 'transfer' (guía) ---
    if (command === 'trans' || command === 'transferir' || command === 'transfer') {
        const replyMessage = `_Usa *${usedPrefix}transferir1 <cantidad> [@usuario]* para transferir monedas._ 🪙\n_Usa *${usedPrefix}transferir2 <cantidad> [@usuario]* para transferir diamantes._ 💎`;
        return m.reply(replyMessage);
    }

    // --- Lógica para el comando 'transferir1' (monedas) ---
    if (command === 'transferir1' || command === 'trans1') {

        let cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply(`_Ingresa una cantidad válida para transferir._\n_Uso correcto: *${usedPrefix}${command} <cantidad> @usuario*_`);
        }

        const MIN_TRANSFER = 250n;
        if (BigInt(cantidad) < MIN_TRANSFER) {
            return m.reply(`_La cantidad mínima para transferir es de *${MIN_TRANSFER}* monedas._`);
        }

        let targetUserJid;
        if (m.isGroup) {
            targetUserJid = m.mentionedJid[0] || m.quoted?.sender || null;
        } else {
            return m.reply("_Este comando solo puede ser utilizado en grupos para transferir a otro usuario._");
        }

        if (!targetUserJid) {
            return m.reply("_Menciona a un usuario o responde a su mensaje para transferirle._");
        }

        if (targetUserJid === m.sender) {
            return m.reply("_No puedes transferirte monedas a ti mismo, idiota._");
        }
        
        const targetUser = global.db.data.users[targetUserJid];
        if (!targetUser || !targetUser.registered) {
            return m.reply(`_*@${String(targetUserJid).split('@')[0]}* no está registrado, no puedes transferirle._`, {
                contextInfo: { mentionedJid: [String(targetUserJid)] }
            });
        }

        const cantidadBig = BigInt(cantidad);
        const comision = cantidadBig / 7n;
        const totalDescontar = cantidadBig + comision;

        const senderMoney = BigInt(user.money || 0);

        if (senderMoney < totalDescontar) {
            return m.reply(`_No tienes suficientes monedas. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._\n_Tu saldo actual es de: *${senderMoney}* monedas._`);
        }

        const targetMoney = BigInt(targetUser.money || 0);
        
        user.money = (senderMoney - totalDescontar).toString();
        targetUser.money = (targetMoney + cantidadBig).toString();

        const replyMessage = `
- _¡Transferencia de monedas exitosa!_ ✅
- _*Enviaste:* *${cantidadBig}* monedas._ 🪙
- _*Comisión del bot:* *${comision}* monedas._ 🤖
- _*Saldo de:* *@${m.sender.split('@')[0]}*: *${user.money}* monedas._ 💰
- _*Saldo de:* *@${targetUserJid.split('@')[0]}*: *${targetUser.money}* monedas._ 💰`;

        await conn.reply(m.chat, replyMessage, m, {
            mentions: [m.sender, targetUserJid]
        });
    }

    // --- Lógica para el comando 'transferir2' (diamantes) ---
    if (command === 'transferir2' || command === 'trans2') {
        
        let cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply(`_Ingresa una cantidad válida para transferir._\n_Uso correcto: *${usedPrefix}${command} <cantidad> @usuario*_`);
        }

        const MIN_TRANSFER = 25n;
        if (BigInt(cantidad) < MIN_TRANSFER) {
            return m.reply(`_La cantidad mínima para transferir es de *${MIN_TRANSFER}* diamantes._`);
        }

        let targetUserJid;
        if (m.isGroup) {
            targetUserJid = m.mentionedJid[0] || m.quoted?.sender || null;
        } else {
            return m.reply("_Este comando solo puede ser utilizado en grupos para transferir a otro usuario._");
        }

        if (!targetUserJid) {
            return m.reply("_Menciona a un usuario o responde a su mensaje para transferirle._");
        }

        if (targetUserJid === m.sender) {
            return m.reply("_No puedes transferirte diamantes a ti mismo._");
        }
        
        const targetUser = global.db.data.users[targetUserJid];
        if (!targetUser || !targetUser.registered) {
            return m.reply(`_*@${String(targetUserJid).split('@')[0]}* no está registrado, no puedes transferirle._`, {
                contextInfo: { mentionedJid: [String(targetUserJid)] }
            });
        }

        const cantidadBig = BigInt(cantidad);
        const comision = cantidadBig / 7n;
        const totalDescontar = cantidadBig + comision;

        const senderDiamonds = BigInt(user.diamonds || 0);

        if (senderDiamonds < totalDescontar) {
            return m.reply(`_No tienes suficientes diamantes. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._\n_Tu saldo actual es de: *${senderDiamonds}* diamantes._`);
        }

        const targetDiamonds = BigInt(targetUser.diamonds || 0);
        
        user.diamonds = (senderDiamonds - totalDescontar).toString();
        targetUser.diamonds = (targetDiamonds + cantidadBig).toString();

        const replyMessage = `
- _¡Transferencia de diamantes exitosa!_ ✅
- _*Enviaste:* *${cantidadBig}* diamantes._ 💎
- _*Comisión del bot:* *${comision}* diamantes._ 🤖
- _*Saldo de:* *@${m.sender.split('@')[0]}*: *${user.diamonds}* diamantes._ 💎
- _*Saldo de:* *@${targetUserJid.split('@')[0]}*: *${targetUser.diamonds}* diamantes._ 💎`;

        await conn.reply(m.chat, replyMessage, m, {
            mentions: [m.sender, targetUserJid]
        });
    }
};

handler.help = ['trans', 'transferir', 'transfer', 'transferir1 <cantidad> [@usuario]', 'trans1 <cantidad> [@usuario]', 'transferir2 <cantidad> [@usuario]', 'trans2 <cantidad> [@usuario]'];
handler.tags = ['economía'];
handler.command = ['trans', 'transferir', 'transfer', 'transferir1', 'trans1', 'transferir2', 'trans2'];
handler.group = true; // Solo funciona en grupos

export default handler;
