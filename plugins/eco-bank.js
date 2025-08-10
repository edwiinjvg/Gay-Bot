const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    if (!user.registered) {
        return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
    }

    if (command === 'bank' || command === 'banco') {
        const userCoin = user.coin || 0;
        const userBankMoney = user.bankMoney || 0;
        const total = userCoin + userBankMoney;

        const saldoMessage = `- _*Saldo en el banco:* ${userBankMoney} monedas._ 🏦\n- _*Dinero total:* ${total} monedas._ 🪙`;
        
        const instruccionesMessage = `_Usa *${usedPrefix}guardar <cantidad>* para guardar monedas._ 🪙\n_Usa *${usedPrefix}retirar <cantidad>* para retirar monedas._ 💸`;
        
        await m.reply(saldoMessage);
        await m.reply(instruccionesMessage);
    }

    else if (command === 'bankg' || command === 'guardar') {
        const cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply("_Ingresa una cantidad válida para guardar._");
        }

        const MIN_GUARDAR = 1000;
        if (cantidad < MIN_GUARDAR) {
            return m.reply(`_El monto mínimo para guardar dinero en el banco es de *${MIN_GUARDAR}* monedas._`);
        }

        const userCoin = user.coin || 0;
        const userBankMoney = user.bankMoney || 0;

        const comision = Math.floor(cantidad / 7);
        const totalDescontar = cantidad + comision;

        if (userCoin < totalDescontar) {
            return m.reply(`_No tienes suficientes monedas. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._`);
        }

        user.coin = userCoin - totalDescontar;
        user.bankMoney = userBankMoney + cantidad;
        user.exp = (user.exp || 0) + 20;

        return m.reply(`- _Guardaste *${cantidad}* monedas en el banco._ 🏦\n- _*Comisión cobrada:* ${comision} monedas._ 🤖\n- _*Dinero en el banco:* ${user.bankMoney} monedas._ 🪙\n- _*Tu saldo actual:* ${user.coin} monedas_ 💰`);
    }

    else if (command === 'bankr' || command === 'retirar') {
        const cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply("_Ingresa una cantidad válida para retirar._");
        }

        const userCoin = user.coin || 0;
        const userBankMoney = user.bankMoney || 0;

        if (userBankMoney < cantidad) {
            return m.reply(`_No tienes suficientes monedas en el banco. Tu saldo en el banco es de: *${userBankMoney}* monedas._`);
        }

        user.coin = userCoin + cantidad;
        user.bankMoney = userBankMoney - cantidad;
        user.exp = (user.exp || 0) + 20;

        return m.reply(`- _Retiraste *${cantidad}* monedas del banco._ 🏦\n- _*Dinero en el banco:* ${user.bankMoney} monedas._ 🪙\n- _*Tu saldo actual:* ${user.coin} monedas._ 💰`);
    }
};

handler.help = ['bank', 'banco', 'bankg <cantidad>', 'guardar <cantidad>', 'bankr <cantidad>', 'retirar <cantidad>'];
handler.tags = ['economía'];
handler.command = ['bank', 'banco', 'bankg', 'guardar', 'bankr', 'retirar'];

export default handler;
