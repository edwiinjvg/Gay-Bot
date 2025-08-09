const defaultImage = 'https://telegra.ph/file/5a5d20739c9413247c1a8.png';

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

        if (isNaN(age) || age <= 9 || age > 50) {
            return m.reply(`_Ingresa una edad válida entre 10 y 50 años._`);
        }
        
        if (user.registered === true) {
            if (!user.reg_id) {
                const new_reg_id = Math.random().toString(36).substring(2, 8).toUpperCase();
                user.reg_id = new_reg_id;
                user.reg_date = user.reg_date || new Date().toLocaleDateString();
                return m.reply(`_Detectamos que estabas registrado pero no tenías un ID. Se te ha asignado uno nuevo: *${new_reg_id}*_\n_Guárdalo, lo necesitarás para eliminar tu registro._`);
            }
            return m.reply(`_Ya estás registrado como *${user.name}*, no puedes registrarte dos veces. Tu ID de registro es: *${user.reg_id}*_`);
        }
        
        const reg_id = Math.random().toString(36).substring(2, 8).toUpperCase();
        const reg_date = new Date().toLocaleDateString();

        let profilePic;
        try {
            profilePic = await conn.profilePictureUrl(m.sender, 'image');
        } catch {
            profilePic = defaultImage;
        }

        user.name = name;
        user.age = age;
        user.registered = true;
        user.reg_id = reg_id;
        user.reg_date = reg_date;
        user.exp = (user.exp || 0) + 50;

        let bonusMessage = '';
        if (!user.bonusReceived) {
            user.money = (user.money || 0) + 2500;
            user.diamonds = (user.diamonds || 0) + 250;
            user.bonusReceived = true; // Variable que no se borrará al desregistrar
            bonusMessage = `_¡Registro exitoso!_ 🎉\n_Recibiste una bonificación de *2500* monedas 🪙 y *250* diamantes._ 💎`;
        } else {
            bonusMessage = `_¡Bienvenido de nuevo, *${name}*!_ 🎉\n_Te has registrado exitosamente._`;
        }
        
        let certificate = `
- _*CERTIFICADO DE REGISTRO*_\n\n- _*Nombre:* ${name}_\n- _*Edad:* ${age}_\n- _*ID de Registro:* ${reg_id}_\n- _*Fecha de Registro:* ${reg_date}_
`.trim();
        
        // Enviar el certificado con la foto de perfil
        await conn.sendMessage(m.chat, {
            image: { url: profilePic },
            caption: certificate,
            contextInfo: { mentionedJid: [m.sender] }
        });
        
        // Enviar el mensaje de la bonificación aparte
        await m.reply(bonusMessage);

    } 
    
    // --- LÓGICA DEL COMANDO .UNREG (.UNREGISTER) ---
    else if (command === 'unreg' || command === 'unregister') {
        const input_id = args[0] ? args[0].toUpperCase() : '';
        
        if (!user.registered) {
            return m.reply("_No estás registrado, usa el comando *.reg* para registrarte._");
        }
        
        if (!input_id || input_id !== user.reg_id) {
            return m.reply(`_ID de registro incorrecto o faltante._\n_Para eliminar tu registro necesitas poner tu ID seguido del comando *.unreg*._\n_Puedes ver tu ID usando el comando *.id*_`);
        }
        
        delete user.name;
        delete user.age;
        delete user.registered;
        delete user.reg_id;
        delete user.reg_date;
        // Se deja user.bonusReceived para que no se entregue la bonificación de nuevo
        
        return m.reply("_Eliminaste tu registro con éxito. Puedes volver a registrarte con el comando *.reg*._");
    }

    // --- LÓGICA DEL COMANDO .MYID (.ID) ---
    else if (command === 'myid' || command === 'id') {
        if (!user.registered) {
            return m.reply("_No estás registrado. Usa el comando *.reg* para obtener tu ID._");
        }
        
        return m.reply(`- _*Tu ID de registro es:* ${user.reg_id || 'N/A'}_`);
    }
};

handler.help = ['reg <nombre> <edad>', 'unreg <id>', 'myid'];
handler.tags = ['general'];
handler.command = ['reg', 'register', 'unreg', 'unregister', 'myid', 'id'];

export default handler;
