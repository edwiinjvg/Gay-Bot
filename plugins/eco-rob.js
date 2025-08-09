const handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender];
    const now = Date.now();
    const cooldown = 10 * 1000; // 2 horas

    if (now - (user.lastRob || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastRob);
        const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
        const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return conn.reply(m.chat, `_¡Acabaste de robar!_\n_Puedes volver a robar en ${horas}h ${minutos}m ${segundos}s._ ⏰`, m);
    }

    let targetUserJid = null;
    if (m.isGroup) {
        targetUserJid = m.mentionedJid[0] || m.quoted?.sender || null;
    } else {
        targetUserJid = m.chat;
    }
    
    if (!targetUserJid) {
        return conn.reply(m.chat, '_Menciona a un usuario o responde a su mensaje para robarle._', m);
    }

    if (targetUserJid === m.sender) {
        return conn.reply(m.chat, "_No puedes robarte a ti mismo, gilipollas._", m);
    }

    const targetUser = global.db.data.users[targetUserJid];
    
    // Verificación segura para ver si el usuario existe y está registrado
    if (!targetUser || !targetUser.registered) {
        const mentioned = targetUserJid && typeof targetUserJid === 'string' ? [targetUserJid] : [];
        return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no está registrado, no puedes robarle._`, m, {
            mentions: mentioned
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
        const mentioned = targetUserJid && typeof targetUserJid === 'string' ? [targetUserJid] : [];
        return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no tiene suficientes monedas ni diamantes para robarle, es un pobretón._ 😹`, m, {
            mentions: mentioned
        });
    }

    user.lastRob = now; // El cooldown se activa antes del resultado del robo

    // 70% de probabilidad de éxito
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

        // Construcción segura del array de menciones
        const mentioned = [m.sender, targetUserJid].filter(jid => jid && typeof jid === 'string');
        await conn.reply(m.chat, `_¡Robo exitoso!_ 😈\n_Le robaste a *@${String(targetUserJid).split('@')[0]}* ${mensajeRobado.join(' y ')}._`, m, {
            mentions: mentioned
        });

    } else {
        // --- LÓGICA DE FRACASO ---
        const cantidadPerdida = BigInt(Math.floor(Math.random() * (800 - 400 + 1)) + 400);
        
        user.money = (robMoneyBig - cantidadPerdida < 0n) ? 0n.toString() : (robMoneyBig - cantidadPerdida).toString();
        
        // Construcción segura del array de menciones
        const mentioned = [m.sender, targetUserJid].filter(jid => jid && typeof jid === 'string');
        await conn.reply(m.chat, `- _El robo a *@${String(targetUserJid).split('@')[0]}* falló._ 👮\n- _En tu huida perdiste *${cantidadPerdida}* monedas._ 🪙`, m, {
            mentions: mentioned
        });
    }
};

handler.help = ['rob', 'robar'];
handler.tags = ['juegos', 'economía'];
handler.command = ['rob', 'robar'];
handler.register = true;

export default handler;
