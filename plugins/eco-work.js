const trabajo = [
    "Trabajaste como diseñador de memes y te dieron",
    "Le arreglaste el WiFi a una doña y te pagó",
    "Hiciste delivery en tu bici y te ganaste",
    "Vendiste empanadas en la esquina y conseguiste",
    "Ayudaste a un ciego a cruzar la calle y te dio",
    "Te disfrazaste de bot y entretuviste a la mara, te soltaron",
    "Chambeaste como DJ en una fiesta y te pagaron",
    "Le limpiaste el celular a un señor con el dedo y te dio",
    "Trabajaste de cuidador de gatos y te dieron",
    "Ayudaste a hackear una tarea y el alumno te soltó",
    "Vendiste stickers en el grupo y ganaste",
    "Hiciste freelance programando bots y te pagaron",
    "Le hiciste la intro a un youtuber y te dio",
    "Fuiste al mercado a ayudar con las bolsas y te dieron",
    "Actuaste como NPC en una app de IA y te pagaron",
    "Te disfrazaste de Pikachu en la plaza y te tiraron",
    "Fuiste plomero por un día y cobraste",
    "Hiciste pasteles con tu abuela y te tocó",
    "Le arreglaste el WhatsApp a una señora y te soltó",
    "Hiciste memes virales y cobraste por la fama",
    "Reparaste consolas retro y ganaste",
    "Enseñaste a un niño a jugar Minecraft y te dieron",
    "Fuiste jurado en un concurso de baile y ganaste",
    "Trabajaste en un bar sirviendo jugos y te pagaron",
    "Vendiste imágenes AI bien mamalonas y te soltaron",
];

const pickRandom = (list) => {
    return list[Math.floor(Math.length * Math.random())];
};

const handler = async (m, { conn, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // Cooldown de 30 minutos (el original)
    const now = Date.now();
    const cooldown = 30 * 60 * 1000;
    
    if (now - (user.lastWork || 0) < cooldown) {
        const tiempoRestante = cooldown - (now - user.lastWork);
        const minutos = Math.floor(tiempoRestante / (60 * 1000));
        const segundos = Math.floor((tiempoRestante % (60 * 1000)) / 1000);
        return m.reply(`_¡Estás cansado!_ ⚠️\n_Vuelve a trabajar en ${minutos}m ${segundos}s._ ⏰`);
    }
    
    // Rango de dinero a ganar de 50 a 200 (el original)
    const minMoney = 100n;
    const maxMoney = 300n;
    
    const earnedMoneyBig = BigInt(Math.floor(Math.random() * Number(maxMoney - minMoney + 1n))) + minMoney;
    
    user.money = (BigInt(user.money || 0n) + earnedMoneyBig).toString();
    user.lastWork = now;
    
    user.exp = (user.exp || 0) + 10;
    
    const replyMessage = `_¡${pickRandom(trabajo)} *{earnedMoneyBig}* monedas!_ 🪙`;
    
    await m.reply(replyMessage);
};

handler.help = ['work', 'trabajar'];
handler.tags = ['economía'];
handler.command = ['work', 'trabajar'];
handler.register = true;

export default handler;
