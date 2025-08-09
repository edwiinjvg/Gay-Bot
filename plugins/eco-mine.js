// URL de imagen por defecto para el comando de minería
const MINE_IMAGE_URL = 'https://telegra.ph/file/a7e376722d56c0717208d.png';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Inicializar el objeto de usuario si no existe
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // El bot ya se encarga de la verificación de registro gracias a `handler.register = true`

    // --- LÓGICA DEL COMANDO .MINE (.MINAR) ---
    if (command === 'mine' || command === 'minar') {
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
        
        const recompensaBig = BigInt(recompensa);
        const userMoney = BigInt(user.money || 0);
        user.money = (userMoney + recompensaBig).toString();
        user.lastMine = now;
        
        user.exp = (user.exp || 0) + 15;
        
        const caption = `_¡Minaste y encontraste *${recompensa}* monedas!_ ⛏️\n_Tu saldo actual es de *${user.money}* monedas._ 💰`;

        await conn.sendMessage(m.chat, {
            image: { url: MINE_IMAGE_URL },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        });
    }

    // --- LÓGICA DEL COMANDO .MINEXP (.MINAR2) ---
    else if (command === 'minexp' || command === 'mine2' || command === 'minar2') {
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

        const xp_before_level_up = user.exp_to_level_up || 1000;
        const level_before = user.level || 0;
        let level_up = false;

        while (user.exp >= xp_before_level_up) {
            user.level = level_before + 1;
            user.exp -= xp_before_level_up;
            user.exp_to_level_up = user.level * 1000;
            level_up = true;
        }

        if (level_up) {
            m.reply(`_Minaste y encontraste *${minedXP} XP*._ ✨⛏️\n\n_¡Felicidades, subiste al nivel *${user.level}*!_ 🎉`);
        } else {
            m.reply(`_Minaste y encontraste *${minedXP} XP*._ ✨⛏️`);
        }
    }
    
    // --- LÓGICA DEL COMANDO .MINE3 (.MINEDI) ---
    else if (command === 'mine3' || command === 'minedi' || command === 'diamantes') {
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
        
        const userDiamonds = BigInt(user.diamonds || 0);
        const minedDiamondsBig = BigInt(minedDiamonds);

        user.diamonds = (userDiamonds + minedDiamondsBig).toString();
        user.lastMine3 = now;

        return m.reply(`_Minaste y encontraste *${minedDiamonds} diamante(s)*._ 💎`);
    }
};

handler.help = ['mine', 'minexp', 'mine3'];
handler.tags = ['economía'];
handler.command = ['mine', 'minar', 'minexp', 'mine2', 'minar2', 'mine3', 'minedi', 'diamantes'];
handler.register = true;

export default handler;
