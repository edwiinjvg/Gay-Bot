// URL de imagen por defecto para el comando de minería (ya no se usa)
// const MINE_IMAGE_URL = 'https://telegra.ph/file/a7e376722d56c0717208d.png';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];

    // --- LÓGICA DEL COMANDO .MINE (.MINAR) ---
    if (command === 'mine' || command === 'minar') {
        if (!user.registered) {
            return m.reply(`_¡Necesitas estar registrado para utilizar este comando!_`);
        }

        const now = Date.now();
        const cooldown = 1 * 60 * 60 * 1000; // 1 hora
        if (now - (user.lastMine || 0) < cooldown) {
            const tiempoRestante = cooldown - (now - user.lastMine);
            const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
            const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
            const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
            return m.reply(`_¡Acabaste de minar!_ ⛏️\n_Puedes volver a minar en ${horas}h ${minutos}m ${segundos}s._ ⏰`);
        }

        const recompensa = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        
        user.coin = (user.coin || 0) + recompensa;
        user.lastMine = now;
        
        user.exp = (user.exp || 0) + 15;
        
        const caption = `_¡Minaste y encontraste *${recompensa}* monedas!_ ⛏️\n_Tu saldo actual es de *${user.coin}* monedas._ 💰`;

        // Ahora solo responde con texto, sin intentar enviar la imagen.
        await m.reply(caption);
    }

    // --- LÓGICA DEL COMANDO .MINEXP (.MINAR2) ---
    else if (command === 'minexp' || command === 'mine2' || command === 'minar2') {
        if (!user.registered) {
            return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
        }

        const now = Date.now();
        const cooldown = 1 * 60 * 60 * 1000; // 1 hora
        if (now - (user.lastMineXP || 0) < cooldown) {
            const tiempoRestante = cooldown - (now - user.lastMineXP);
            const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
            const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
            const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
            return m.reply(`_¡Acabaste de minar!_ ⛏️\n_Puedes volver a minar *XP* en ${horas}h ${minutos}m y ${segundos}s._ ⏰`);
        }

        const minedXP = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
        user.exp = (user.exp || 0) + minedXP;
        user.lastMineXP = now;

        m.reply(`_Minaste y encontraste *${minedXP} XP*._ ✨⛏️`);
    }
    
    // --- LÓGICA DEL COMANDO .MINE3 (.MINEDI) ---
    else if (command === 'mine3' || command === 'minedi' || command === 'diamantes') {
        if (!user.registered) {
            return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
        }
        
        const now = Date.now();
        const cooldown = 1.5 * 60 * 60 * 1000; // 1.5 horas
        if (now - (user.lastMine3 || 0) < cooldown) {
            const tiempoRestante = cooldown - (now - user.lastMine3);
            const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
            const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
            const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
            return m.reply(`_¡Acabaste de minar!_ ⛏️\n_Puedes volver a minar diamantes en ${horas}h ${minutos}m y ${segundos}s._ ⏰`);
        }

        const minedDiamonds = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
        
        user.diamond = (user.diamond || 0) + minedDiamonds;
        user.lastMine3 = now;

        return m.reply(`_Minaste y encontraste *${minedDiamonds} diamante(s)*._ 💎`);
    }
};

handler.help = ['mine', 'minexp', 'mine3'];
handler.tags = ['economía'];
handler.command = ['mine', 'minar', 'minexp', 'mine2', 'minar2', 'mine3', 'minedi', 'diamantes'];
handler.register = true;

export default handler;
