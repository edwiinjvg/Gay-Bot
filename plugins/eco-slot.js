const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    if (!user.registered) {
        return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
    }

    if (command === 'slot' || command === 'casino' || command === 'apuesta' || command === 'apostar') {
        const replyMessage = `_Usa *${usedPrefix}slot1 <cantidad>* para apostar monedas._ 🪙\n_Usa *${usedPrefix}slot2 <cantidad>* para apostar diamantes._ 💎`;
        return m.reply(replyMessage);
    }
    
    else if (command === 'slot1' || command === 'casino1' || command === 'apuesta1' || command === 'apostar1') {
        const apuesta = Number(args[0]);

        if (isNaN(apuesta) || apuesta <= 0) {
            return m.reply(`_Ingresa una cantidad válida para apostar._`);
        }
        
        if (apuesta < 250) {
            return m.reply(`_La apuesta mínima es de *250* monedas._`);
        }
        
        const userCoin = user.coin || 0;

        if (userCoin < apuesta) {
            return m.reply(`_No tienes suficientes monedas para apostar *${apuesta}*._ 🪙\n\n_Tu saldo actual es de: *${userCoin}* monedas._ 💰`);
        }

        user.coin = userCoin - apuesta;

        const emojis = ['🍒', '🍑', '🍆'];
        let resultado = [];
        let gana = false;

        if (Math.random() <= 0.40) {
            gana = true;
            const emojiGanador = emojis[Math.floor(Math.random() * emojis.length)];
            resultado = [emojiGanador, emojiGanador, emojiGanador];
        } else {
            resultado = emojis.sort(() => 0.5 - Math.random()).slice(0, 3);
        }

        await conn.sendMessage(m.chat, { react: { text: "🎰", key: m.key } });

        let textoRespuesta = `
🎰 *「 SLOT 」* 🎰
------------------------------
     ${resultado.join(' | ')}
------------------------------
`;

        if (gana) {
            const premio = apuesta * 2; 
            user.coin = user.coin + premio;
            textoRespuesta += `
*¡Ganaste!* 😺\n_Has ganado *${premio}* monedas._ 🪙`;
        } else {
            textoRespuesta += `
*¡Perdiste!* 😿\n_Has perdido *${apuesta}* monedas._ 🪙`;
        }

        user.exp = (user.exp || 0) + 15;
        
        textoRespuesta += `\n_Saldo actual: ${user.coin} monedas_ 💰`;

        await m.reply(textoRespuesta);
    }

    else if (command === 'slot2' || command === 'casino2' || command === 'apuesta2') {
        const apuesta = Number(args[0]);

        if (isNaN(apuesta) || apuesta <= 0) {
            return m.reply(`_Ingresa una cantidad válida para apostar._`);
        }
        
        if (apuesta < 25) {
            return m.reply(`_La apuesta mínima es de *25* diamantes._`);
        }
        
        const userDiamond = user.diamond || 0;
        
        if (userDiamond < apuesta) {
            return m.reply(`_No tienes suficientes diamantes para apostar *${apuesta}*._ 💎\n\n_Tu saldo actual es de: *${userDiamond}* diamantes._ 💎`);
        }

        user.diamond = userDiamond - apuesta;

        const emojis = ['🍒', '🍑', '🍆'];
        let resultado = [];
        let gana = false;

        if (Math.random() <= 0.30) {
            gana = true;
            const emojiGanador = emojis[Math.floor(Math.random() * emojis.length)];
            resultado = [emojiGanador, emojiGanador, emojiGanador];
        } else {
            resultado = emojis.sort(() => 0.5 - Math.random()).slice(0, 3);
        }

        await conn.sendMessage(m.chat, { react: { text: "🎰", key: m.key } });

        let textoRespuesta = `
🎰 *「 SLOT 」* 🎰
------------------------------
     ${resultado.join(' | ')}
------------------------------
`;

        if (gana) {
            const premio = apuesta * 2; 
            user.diamond = user.diamond + premio;
            textoRespuesta += `
*¡Ganaste!* 😺\n_Has ganado *${premio}* diamantes._ 💎`;
        } else {
            textoRespuesta += `
*¡Perdiste!* 😿\n_Has perdido *${apuesta}* diamantes._ 💎`;
        }

        user.exp = (user.exp || 0) + 15;
        
        textoRespuesta += `\n_Saldo actual: *${user.diamond}* diamantes_ 💎`;

        await m.reply(textoRespuesta);
    }
};

handler.help = ['slot', 'slot1 <cantidad>', 'slot2 <cantidad>'];
handler.tags = ['economía'];
handler.command = ['slot', 'casino', 'apuesta', 'apostar', 'slot1', 'casino1', 'apuesta1', 'apostar1', 'slot2', 'casino2', 'apuesta2'];
handler.register = true;

module.exports = handler;
