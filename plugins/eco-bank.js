const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // --- VERIFICACIÓN DE REGISTRO PARA TODOS LOS COMANDOS ---
    if (!user.registered) {
        return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
    }

    // --- LÓGICA DEL COMANDO .BANK (.BANCO) ---
    if (command === 'bank' || command === 'banco') {
        const userMoney = BigInt(user.money || 0);
        const userBankMoney = BigInt(user.bankMoney || 0);
        const total = userMoney + userBankMoney;

        const saldoMessage = `_Saldo en el banco: *${userBankMoney}* monedas._ 🏦\n_Dinero total: *${total}* monedas._ 🪙`;
        
        const instruccionesMessage = `_Usa *${usedPrefix}guardar <cantidad>* para guardar monedas._ 🪙\n_Usa *${usedPrefix}retirar <cantidad>* para retirar monedas._ 💸`;
        
        await m.reply(saldoMessage);
        await m.reply(instruccionesMessage);
    }

    // --- LÓGICA DEL COMANDO .BANKG (.GUARDAR) ---
    else if (command === 'bankg' || command === 'guardar') {
        const cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply("_Ingresa una cantidad válida para guardar._");
        }

        const MIN_GUARDAR = 1000;
        if (cantidad < MIN_GUARDAR) {
            return m.reply(`_El monto mínimo para guardar dinero en el banco es de *${MIN_GUARDAR}* monedas._`);
        }

        const userMoney = BigInt(user.money || 0);
        const userBankMoney = BigInt(user.bankMoney || 0);
        const cantidadBig = BigInt(cantidad);

        const comision = cantidadBig / 7n;
        const totalDescontar = cantidadBig + comision;

        if (userMoney < totalDescontar) {
            return m.reply(`_No tienes suficientes monedas. Necesitas *${totalDescontar}* (incluyendo la comisión de *${comision}*)._`);
        }

        user.money = (userMoney - totalDescontar).toString();
        user.bankMoney = (userBankMoney + cantidadBig).toString();
        user.exp = (user.exp || 0) + 20;

        return m.reply(`_Guardaste *${cantidadBig}* monedas en el banco._ 🏦\n_*Comisión cobrada:* ${comision} monedas._ 🤖\n_*Dinero en el banco:* ${user.bankMoney} monedas._ 🪙\n_*Tu saldo actual:* ${user.money} monedas_ 💰`);
    }

    // --- LÓGICA DEL COMANDO .BANKR (.RETIRAR) ---
    else if (command === 'bankr' || command === 'retirar') {
        const cantidad = Number(args[0]);

        if (isNaN(cantidad) || cantidad <= 0) {
            return m.reply("_Ingresa una cantidad válida para retirar._");
        }

        const userMoney = BigInt(user.money || 0);
        const userBankMoney = BigInt(user.bankMoney || 0);
        const cantidadBig = BigInt(cantidad);

        if (userBankMoney < cantidadBig) {
            return m.reply(`_No tienes suficientes monedas en el banco. Tu saldo en el banco es de: *${userBankMoney}* monedas._`);
        }

        user.money = (userMoney + cantidadBig).toString();
        user.bankMoney = (userBankMoney - cantidadBig).toString();
        user.exp = (user.exp || 0) + 20;

        return m.reply(`_Retiraste *${cantidadBig}* monedas del banco._ 🏦\n_*Dinero en el banco:* ${user.bankMoney} monedas._ 🪙\n_*Tu saldo actual:* ${user.money} monedas._ 💰`);
    }
};

handler.help = ['bank', 'banco', 'bankg <cantidad>', 'guardar <cantidad>', 'bankr <cantidad>', 'retirar <cantidad>'];
handler.tags = ['economía'];
handler.command = ['bank', 'banco', 'bankg', 'guardar', 'bankr', 'retirar'];

export default handler;
