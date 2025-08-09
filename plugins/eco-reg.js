const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Inicializar el objeto de usuario si no existe
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // --- LÓGICA DEL COMANDO .REG (.REGISTER) ---
    if (command === 'reg' || command === 'register') {
        if (args.length < 2) {
            return m.reply(`_Para registrarte, usa: ${usedPrefix}reg <nombre> <edad>_`);
        }

        const name = args[0];
        const age = parseInt(args[1]);

        if (isNaN(age) || age <= 10 || age > 50) {
            return m.reply(`_Ingresa una edad válida entre 11 y 50 años._`);
        }

        if (user.registered === true) {
            return m.reply(`_Ya estás registrado como *${user.name}*, no puedes registrarte dos veces._`);
        }

        let hasBonus = false;
        if (!user.hasRegistered) {
            user.money = (user.money || 0) + 2500;
            user.diamonds = (user.diamonds || 0) + 250;
            user.hasRegistered = true;
            hasBonus = true;
        }

        user.name = name;
        user.age = age;
        user.registered = true;
        user.exp = (user.exp || 0) + 50;

        if (hasBonus) {
            m.reply(`_¡Registro exitoso, *${name}*!_ 🎉\n_Recibiste una bonificación de *2500* monedas 🪙 y *250* diamantes._ 💎`);
        } else {
            m.reply(`_¡Bienvenido de nuevo, *${name}*!_ 🎉\n_Te has registrado exitosamente._`);
        }
    } 
    
    // --- LÓGICA DEL COMANDO .UNREG (.UNREGISTER) ---
    else if (command === 'unreg' || command === 'unregister') {
        if (!user.registered) {
            return m.reply("_No estás registrado, usa el comando .reg para registrarte._");
        }
        
        // Eliminar las propiedades de registro
        delete user.name;
        delete user.age;
        delete user.registered;
        delete user.hasRegistered;
        
        return m.reply("_Eliminaste tu registro con éxito. Puedes volver a registrarte con el comando .reg._");
    }
};

handler.help = ['reg <nombre> <edad>', 'unreg'];
handler.tags = ['general'];
handler.command = ['reg', 'register', 'unreg', 'unregister'];

export default handler;
