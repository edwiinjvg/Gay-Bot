const handler = async (m, { conn, args, usedPrefix, command }) => {

    const isGroup = m.chat.endsWith('@g.us');
    if (!isGroup) {
        return conn.reply(m.chat, '_¡Este comando solo puede ser utilizado en grupos!_', m);
    }
    
    const user = global.db.data.users[m.sender];
    const now = Date.now();
    const cooldown = 2 * 60 * 60 * 1000; // 2 horas

    if (now - (user.lastRob || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastRob);
        const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
        const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return conn.reply(m.chat, `_¡Acabaste de robar!_ ⏰\n_Puedes volver a robar en ${horas}h ${minutos}m ${segundos}s._`, m);
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
    
    if (!targetUser || !targetUser.registered) {
        const mentioned = targetUserJid && typeof targetUserJid === 'string' ? [targetUserJid] : [];
        return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no está registrado, no puedes robarle._`, m, {
            mentions: mentioned
        });
    }

    // Usando números estándar de JavaScript para la consistencia
    const targetCoin = targetUser.coin || 0;
    const targetDiamond = targetUser.diamond || 0;
    const userCoin = user.coin || 0;
    const userDiamond = user.diamond || 0;

    const MIN_COIN = 500;
    const MIN_DIAMONDS = 50;

    if (targetCoin < MIN_COIN && targetDiamond < MIN_DIAMONDS) {
        user.lastRob = now;
        const mentioned = targetUserJid && typeof targetUserJid === 'string' ? [targetUserJid] : [];
        return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no tiene suficientes monedas ni diamantes para robarle, es un pobretón._ 😹`, m, {
            mentions: mentioned
        });
    }

    user.lastRob = now; // El cooldown se activa antes del resultado del robo

    if (Math.random() < 0.8) {
        // --- LÓGICA DE ÉXITO ---
        const cantidadRobadaMonedas = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        const cantidadRobadaDiamantes = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        
        let mensajeRobado = [];

        if (targetCoin >= MIN_COIN) {
            user.coin = userCoin + cantidadRobadaMonedas;
            targetUser.coin = Math.max(0, targetCoin - cantidadRobadaMonedas);
            mensajeRobado.push(`*${cantidadRobadaMonedas}* monedas 🪙`);
        }

        if (targetDiamond >= MIN_DIAMONDS) {
            user.diamond = userDiamond + cantidadRobadaDiamantes;
            targetUser.diamond = Math.max(0, targetDiamond - cantidadRobadaDiamantes);
            mensajeRobado.push(`*${cantidadRobadaDiamantes}* diamantes 💎`);
        }
        
        user.exp = (user.exp || 0) + 25;

        const mentioned = [m.sender, targetUserJid].filter(jid => jid && typeof jid === 'string');
        await conn.reply(m.chat, `_¡Robo exitoso!_ 😈\n_Le robaste a *@${String(targetUserJid).split('@')[0]}* ${mensajeRobado.join(' y ')}._`, m, {
            mentions: mentioned
        });

    } else {
        // --- LÓGICA DE FRACASO ---
        const cantidadPerdida = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        
        user.coin = Math.max(0, userCoin - cantidadPerdida);
        
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
handler.group = true;

export default handler;
