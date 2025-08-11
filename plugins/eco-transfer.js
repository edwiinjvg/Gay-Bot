const handler = async (m, { conn, args, usedPrefix, command }) => {
    
    const user = global.db.data.users[m.sender];
    if (!user || !user.registered) {
        return m.reply('_¡Necesitas estar registrado para poder utilizar este comando!_');
    }

    if (command === 'trans' || command === 'transferir' || command === 'transfer') {
        const replyMessage = `_Usa *${usedPrefix}transfer1 <cantidad> [@usuario]* para transferir monedas._ 🪙\n_Usa *${usedPrefix}transfer2 <cantidad> [@usuario]* para transferir diamantes._ 💎`;
        return m.reply(replyMessage);
    }

    if (command === 'transfer1' || command === 'trans1') {

        let cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply(`_Ingresa una cantidad válida para transferir._\n_Uso correcto: *${usedPrefix}${command} <cantidad> @usuario*_`);
        }

        const MIN_TRANSFER = 500;
        if (cantidad < MIN_TRANSFER) {
            return m.reply(`_La cantidad mínima para transferir es de *${MIN_TRANSFER}* monedas._`);
        }

        let targetUserJid;
        if (m.isGroup) {
            // CORREGIDO: Reemplazado 'm.quoted?.sender' por una comprobación 'if'
            if (m.quoted && m.quoted.sender) {
                targetUserJid = m.quoted.sender;
            } else {
                targetUserJid = m.mentionedJid[0] || null;
            }
        } else {
            return m.reply("_¡Este comando solo puede ser utilizado en grupos!_");
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

        const comision = Math.floor(cantidad / 8);
        const totalDescontar = cantidad + comision;

        const senderCoin = user.coin || 0;

        if (senderCoin < totalDescontar) {
            return m.reply(`_No tienes suficientes monedas. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._\n_Tu saldo actual es de: *${senderCoin}* monedas._`);
        }

        const targetCoin = targetUser.coin || 0;
        
        user.coin = senderCoin - totalDescontar;
        targetUser.coin = targetCoin + cantidad;

        const replyMessage = `
- _¡Transferencia de monedas exitosa!_ ✅
- _*Enviaste:* *${cantidad}* monedas._ 🪙
- _*Comisión del bot:* *${comision}* monedas._ 🤖
- _*Saldo de:* *@${m.sender.split('@')[0]}*: *${user.coin}* monedas._ 💰
- _*Saldo de:* *@${targetUserJid.split('@')[0]}*: *${targetUser.coin}* monedas._ 💰`;

        await conn.reply(m.chat, replyMessage, m, {
            mentions: [m.sender, targetUserJid]
        });
    }

    if (command === 'transfer2' || command === 'trans2') {
        
        let cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply(`_Ingresa una cantidad válida para transferir._\n_Uso correcto: *${usedPrefix}${command} <cantidad> @usuario*_`);
        }

        const MIN_TRANSFER = 50;
        if (cantidad < MIN_TRANSFER) {
            return m.reply(`_La cantidad mínima para transferir es de *${MIN_TRANSFER}* diamantes._`);
        }

        let targetUserJid;
        if (m.isGroup) {
            // CORREGIDO: Reemplazado 'm.quoted?.sender' por una comprobación 'if'
            if (m.quoted && m.quoted.sender) {
                targetUserJid = m.quoted.sender;
            } else {
                targetUserJid = m.mentionedJid[0] || null;
            }
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

        const comision = Math.floor(cantidad / 8);
        const totalDescontar = cantidad + comision;

        const senderDiamond = user.diamond || 0;

        if (senderDiamond < totalDescontar) {
            return m.reply(`_No tienes suficientes diamantes. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._\n_Tu saldo actual es de: *${senderDiamond}* diamantes._`);
        }

        const targetDiamond = targetUser.diamond || 0;
        
        user.diamond = senderDiamond - totalDescontar;
        targetUser.diamond = targetDiamond + cantidad;

        const replyMessage = `
- _¡Transferencia de diamantes exitosa!_ ✅
- _*Enviaste:* *${cantidad}* diamantes._ 💎
- _*Comisión del bot:* *${comision}* diamantes._ 🤖
- _*Saldo de:* *@${m.sender.split('@')[0]}*: *${user.diamond}* diamantes._ 💎
- _*Saldo de:* *@${targetUserJid.split('@')[0]}*: *${targetUser.diamond}* diamantes._ 💎`;

        await conn.reply(m.chat, replyMessage, m, {
            mentions: [m.sender, targetUserJid]
        });
    }
};

handler.help = ['trans', 'transferir', 'transfer', 'transferir1 <cantidad> [@usuario]', 'trans1 <cantidad> [@usuario]', 'transferir2 <cantidad> [@usuario]', 'trans2 <cantidad> [@usuario]'];
handler.tags = ['economía'];
handler.command = ['trans', 'transferir', 'transfer', 'transfer1', 'trans1', 'transfer2', 'trans2'];
handler.group = true; 

export default handler;
