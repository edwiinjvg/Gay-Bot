const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // --- VERIFICACIÓN DE REGISTRO PARA TODOS LOS COMANDOS ---
    if (!user.registered) {
        return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
    }

    // --- LÓGICA DEL COMANDO .SLOT (.CASINO) ---
    if (command === 'slot' || command === 'casino' || command === 'apuesta' || command === 'apostar') {
        const replyMessage = `_Usa *${usedPrefix}slot1 <cantidad>* para apostar monedas._ 🪙\n_Usa *${usedPrefix}slot2 <cantidad>* para apostar diamantes._ 💎`;
        return m.reply(replyMessage);
    }
    
    // --- LÓGICA DEL COMANDO .SLOT1 (APUESTA CON MONEDAS) ---
    else if (command === 'slot1' || command === 'casino1' || command === 'apuesta1' || command === 'apostar1') {
        const apuesta = Number(args[0]);

        if (isNaN(apuesta) || apuesta <= 0) {
            return m.reply(`_Ingresa una cantidad válida para apostar._`);
        }
        
        if (apuesta < 250) {
            return m.reply(`_La apuesta mínima es de *250* monedas._`);
        }
        
        const apuestaBig = BigInt(apuesta);
        const userMoney = BigInt(user.money || 0);

        if (userMoney < apuestaBig) {
            return m.reply(`_No tienes suficientes monedas para apostar *${apuestaBig}*._ 🪙\n\n_Tu saldo actual es de: *${userMoney}* monedas._ 💰`);
        }

        user.money = (userMoney - apuestaBig).toString();

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
            const premio = apuestaBig * 2n; 
            user.money = (BigInt(user.money) + premio).toString();
            textoRespuesta += `
*¡Ganaste!* 😺\n_Has ganado *${premio}* monedas._ 🪙`;
        } else {
            textoRespuesta += `
*¡Perdiste!* 😿\n_Has perdido *${apuestaBig}* monedas._ 🪙`;
        }

        user.exp = (user.exp || 0) + 15;
        
        textoRespuesta += `\n_Saldo actual: ${user.money} monedas_ 💰`;

        await m.reply(textoRespuesta);
    }

    // --- LÓGICA DEL COMANDO .SLOT2 (APUESTA CON DIAMANTES) ---
    else if (command === 'slot2' || command === 'casino2' || command === 'apuesta2') {
        const apuesta = Number(args[0]);

        if (isNaN(apuesta) || apuesta <= 0) {
            return m.reply(`_Ingresa una cantidad válida para apostar._`);
        }
        
        if (apuesta < 25) {
            return m.reply(`_La apuesta mínima es de *25* diamantes._`);
        }
        
        const apuestaBig = BigInt(apuesta);
        const userDiamonds = BigInt(user.diamonds || 0);
        
        if (userDiamonds < apuestaBig) {
            return m.reply(`_No tienes suficientes diamantes para apostar *${apuestaBig}*._ 💎\n\n_Tu saldo actual es de: *${userDiamonds}* diamantes._ 💎`);
        }

        user.diamonds = (userDiamonds - apuestaBig).toString();

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
            const premio = apuestaBig * 2n; 
            user.diamonds = (BigInt(user.diamonds) + premio).toString();
            textoRespuesta += `
*¡Ganaste!* 😺\n_Has ganado *${premio}* diamantes._ 💎`;
        } else {
            textoRespuesta += `
*¡Perdiste!* 😿\n_Has perdido *${apuestaBig}* diamantes._ 💎`;
        }

        user.exp = (user.exp || 0) + 15;
        
        textoRespuesta += `\n_Saldo actual: *${user.diamonds}* diamantes_ 💎`;

        await m.reply(textoRespuesta);
    }
};

handler.help = ['slot', 'slot1 <cantidad>', 'slot2 <cantidad>'];
handler.tags = ['economía'];
handler.command = ['slot', 'casino', 'apuesta', 'apostar', 'slot1', 'casino1', 'apuesta1', 'slot2', 'casino2', 'apuesta1', 'apostar2'];

export default handler;
