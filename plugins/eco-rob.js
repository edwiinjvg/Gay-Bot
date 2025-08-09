const handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender];
    const now = Date.now();
    const cooldown = 2 * 60 * 60 * 1000; // 2 horas

    if (now - (user.lastRob || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastRob);
        const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
        const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return m.reply(`_¡Acabaste de robar!_\n_Puedes volver a robar en ${horas}h ${minutos}m ${segundos}s._ ⏰`);
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
        return m.reply("_No puedes robarte a ti mismo, gilipollas._");
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
    const robMoneyBig = BigInt(user.money || 0);

    const MIN_MONEY = 500n;
    const MIN_DIAMONDS = 50n;

    if (targetMoneyBig < MIN_MONEY && targetDiamondsBig < MIN_DIAMONDS) {
        user.lastRob = now;
        return m.reply(`_*@${targetUserJid.split('@')[0]}* no tiene suficientes monedas ni diamantes para robarle, es un pobretón._ 😹`, {
            contextInfo: { mentionedJid: [targetUserJid] }
        });
    }

    user.lastRob = now; // El cooldown se activa antes del resultado del robo

    // 60% de probabilidad de éxito
    if (Math.random() < 0.7) {
        // --- LÓGICA DE ÉXITO ---
        const cantidadRobadaMonedas = BigInt(Math.floor(Math.random() * (1000 - 500 + 1)) + 500);
        const cantidadRobadaDiamantes = BigInt(Math.floor(Math.random() * (100 - 50 + 1)) + 50);
        
        const robDiamondsBig = BigInt(user.diamonds || 0);
        
        let mensajeRobado = [];

        if (targetMoneyBig >= MIN_MONEY) {
            user.money = (robMoneyBig + cantidadRobadaMonedas).toString();
            targetUser.money = (targetMoneyBig - cantidadRobadaMonedas).toString();
            mensajeRobado.push(`*${cantidadRobadaMonedas}* monedas 🪙`);
        }

        if (targetDiamondsBig >= MIN_DIAMONDS) {
            user.diamonds = (robDiamondsBig + cantidadRobadaDiamantes).toString();
            targetUser.diamonds = (targetDiamondsBig - cantidadRobadaDiamantes).toString();
            mensajeRobado.push(`*${cantidadRobadaDiamantes}* diamantes 💎`);
        }
        
        user.exp = (user.exp || 0) + 25;

        await conn.sendMessage(m.chat, {
            text: `_¡Robo exitoso!_ 😈\n_Le robaste a *@${targetUserJid.split('@')[0]}* ${mensajeRobado.join(' y ')}._`,
            contextInfo: { mentionedJid: [m.sender, targetUserJid] }
        });

    } else {
        // --- LÓGICA DE FRACASO ---
        const cantidadPerdida = BigInt(Math.floor(Math.random() * (700 - 400 + 1)) + 400);
        
        user.money = (robMoneyBig - cantidadPerdida < 0n) ? 0n.toString() : (robMoneyBig - cantidadPerdida).toString();
        
        await conn.sendMessage(m.chat, {
            text: `_El robo a *@${targetUserJid.split('@')[0]}* falló._ 👮\n_En tu huida perdiste *${cantidadPerdida}* monedas._ 🪙`,
            contextInfo: { mentionedJid: [m.sender, targetUserJid] }
        });
    }
};

handler.help = ['rob', 'robar'];
handler.tags = ['juegos', 'economía'];
handler.command = ['rob', 'robar'];
handler.register = true;

export default handler;
