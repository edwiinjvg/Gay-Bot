// Usamos 'require' para importar el archivo JSON, compatible con versiones antiguas de Node.js
const trabajo = require('../json/work.json');

const pickRandom = (list) => {
    return list[Math.floor(list.length * Math.random())];
};

const handler = async (m, { conn, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // Cooldown de 30 minutos
    const now = Date.now();
    const cooldown = 30 * 60 * 1000;
    
    if (now - (user.lastWork || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastWork);
        const minutos = Math.floor(tiempoRestante / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return m.reply(`_¡Estás cansado!_ ⚠️\n_Vuelve a trabajar en ${minutos}m ${segundos}s._ ⏰`);
    }
    
    // Rango de dinero a ganar de 100 a 300
    const minMoney = 100;
    const maxMoney = 300;
    
    const earnedMoney = Math.floor(Math.random() * (maxMoney - minMoney + 1)) + minMoney;
    
    user.coin = (user.coin || 0) + earnedMoney;
    user.lastWork = now;
    
    user.exp = (user.exp || 0) + 10;
    
    // Mensaje de respuesta
    const replyMessage = `_¡${pickRandom(trabajo)} *${earnedMoney}* monedas!_ 🪙`;
    
    await m.reply(replyMessage);
};

handler.help = ['work', 'trabajar'];
handler.tags = ['economía'];
handler.command = ['work', 'trabajar'];
handler.register = true;

export default handler;
