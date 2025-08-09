const handler = async (m, { conn, args, usedPrefix, command }) => {
    // El bot ya se encarga de la verificación de registro gracias a `handler.register = true`

    const user = global.db.data.users[m.sender];
    const now = Date.now();
    const cooldown = 1.5 * 60 * 60 * 1000; // 1.5 horas

    if (now - (user.lastRob || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastRob);
        const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
        const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return m.reply(`_Acabaste de robar._\n_Puedes volver a robar en ${horas}h ${minutos}m ${segundos}s._ ⏰`);
    }

    let targetUserJid;
    if (m.isGroup) {
        targetUserJid = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    } else {
        targetUserJid = m.chat;
    }
    
    if (!targetUserJid) {
        return m.reply(`_Menciona a un usuario o responde a su mensaje para robarle._`);
    }

    if (targetUserJid === m.sender) {
        return m.reply("_No puedes robarte a ti mismo, gilipollas._ 🧠?");
    }

    const targetUser = global.db.data.users[targetUserJid] || {};

    if (!targetUser.registered) {
        return m.reply(`_*@${targetUserJid.split('@')[0]}* no está registrado, no puedes robarle._`, {
            contextInfo: { mentionedJid: [targetUserJid] }
        });
    }

    // --- USANDO BIGINT PARA CÁLCULOS EXACTOS ---
    const targetMoneyBig = BigInt(targetUser.money || 0);
    const targetDiamondsBig = BigInt(targetUser.diamonds || 0);
    
    const MIN_MONEY = 300n;
    const MIN_DIAMONDS = 30n;

    if (targetMoneyBig < MIN_MONEY && targetDiamondsBig < MIN_DIAMONDS) {
        user.lastRob = now; // El cooldown se activa aunque falle el robo
        return m.reply(`_*@${targetUserJid.split('@')[0]}* no tiene suficientes monedas ni diamantes para robarle, es un pobretón._ 😹`, {
            contextInfo: { mentionedJid: [targetUserJid] }
        });
    }

    const cantidadRobadaMonedas = BigInt(Math.floor(Math.random() * (500 - 200 + 1)) + 200);
    const cantidadRobadaDiamantes = BigInt(Math.floor(Math.random() * (60 - 20 + 1)) + 20);

    const robMoneyBig = BigInt(user.money || 0);
    const robDiamondsBig = BigInt(user.diamonds || 0);
    
    let mensajeMonedas = '';
    let mensajeDiamantes = '';

    if (targetMoneyBig >= MIN_MONEY) {
        user.money = (robMoneyBig + cantidadRobadaMonedas).toString();
        targetUser.money = (targetMoneyBig - cantidadRobadaMonedas).toString();
        mensajeMonedas = `*${cantidadRobadaMonedas}* monedas 🪙`;
    }

    if (targetDiamondsBig >= MIN_DIAMONDS) {
        user.diamonds = (robDiamondsBig + cantidadRobadaDiamantes).toString();
        targetUser.diamonds = (targetDiamondsBig - cantidadRobadaDiamantes).toString();
        mensajeDiamantes = `y *${cantidadRobadaDiamantes}* diamantes 💎`;
    }
    
    user.lastRob = now;
    user.exp = (user.exp || 0) + 25;
    
    const replyMessage = `- _¡Robo exitoso!_ 😈\n- _*@${m.sender.split('@')[0]}* le robó a *@${targetUserJid.split('@')[0]}:*_\n- _${mensajeMonedas} ${mensajeDiamantes}._\n\n- _Saldo de *@${m.sender.split('@')[0]}*:_\n- _*${user.money}* monedas y *${user.diamonds}* diamantes._\n- _Saldo de *@${targetUserJid.split('@')[0]}*:_\n- _*${targetUser.money}* monedas y *${targetUser.diamonds}* diamantes._`;

    await m.reply(replyMessage, {
        contextInfo: { mentionedJid: [m.sender, targetUserJid] }
    });
};

handler.help = ['rob', 'robar'];
handler.tags = ['juegos', 'economía'];
handler.command = ['rob', 'robar'];
handler.register = true;

export default handler;
