const handler = async (m, { conn, usedPrefix, command }) => {
    
    const user = global.db.data.users[m.sender];
    if (!user) {
        return m.reply('_Parece que no tienes un perfil. Intenta usar otro comando para que se cree._');
    }

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 horas

    if (now - (user.lastReward || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastReward);
        const horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
        const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return m.reply(`_Ya reclamaste tu recompensa diaria._ ⏰\n_Puedes volver a reclamarla en ${horas}h ${minutos}m ${segundos}s._`);
    }

    // Usando números estándar de JavaScript
    const recompensa = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    const xpRecompensa = Math.floor(Math.random() * (500 - 200 + 1)) + 300;
    const diamantesRecompensa = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

    user.coin = (user.coin || 0) + recompensa;
    user.diamond = (user.diamond || 0) + diamantesRecompensa;
    user.lastReward = now;
    
    user.exp = (user.exp || 0) + xpRecompensa;
    
    return m.reply(`
- _Reclamaste tu recompensa diaria, obtuviste:_
- _*${recompensa}* monedas._ 🪙
- _*${xpRecompensa}* XP._ ✨
- _*${diamantesRecompensa}* diamantes._ 💎`);
};

handler.help = ['daily', 'recompensa'];
handler.tags = ['economía'];
handler.command = ['daily', 'claim'];
handler.register = true;

export default handler;
