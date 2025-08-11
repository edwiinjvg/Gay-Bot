const defaultImage = 'https://telegra.ph/file/5a5d20739c9413247c1a8.png';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
    }
    const user = global.db.data.users[m.sender];
    
    // --- VERIFICACIÓN DE REGISTRO PARA TODOS LOS COMANDOS ---
    if (!user.registered) {
        return m.reply(`_No estás registrado. Usa el comando *${usedPrefix}reg* para registrarte._`);
    }

    // --- LÓGICA DEL COMANDO .PROFILE (.PERFIL) ---
    if (command === 'profile' || command === 'perfil') {
        let targetUserJid = m.mentionedJid[0] || m.quoted?.sender || m.sender;
        let targetUserData = global.db.data.users[targetUserJid] || {};

        if (!targetUserData.registered) {
             return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no está registrado.`, m, {
                mentions: [targetUserJid]
            });
        }

        let registrationStatus = '_Sí_ ✅';
        let registrationId = targetUserData.reg_id || 'N/A';
        let name = targetUserData.name || `@${targetUserJid.split('@')[0]}`;
        let age = targetUserData.age || 'N/A';
        let coin = targetUserData.coin || 0;
        let diamond = targetUserData.diamond || 0;
        let role = targetUserData.role || 'Hetere 😴';
        
        let level = targetUserData.level || 0;
        let xp = targetUserData.exp || 0;
        let xpForNextLevel = (level + 1) * 1000;
        
        let partnerJid = targetUserData.partnerJid;
        let partnerInfo = "_Sin pareja_ 😹";
        let mentions = [targetUserJid];
    
        if (partnerJid && global.db.data.users[partnerJid]) {
            const partnerData = global.db.data.users[partnerJid];
            const partnerName = partnerData.name || `@${partnerJid.split('@')[0]}`;
            partnerInfo = `_*@${partnerJid.split('@')[0]}* (${partnerName})._ 💕`;
            mentions.push(partnerJid);
        }
        
        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(targetUserJid, 'image');
        } catch {
            profilePicUrl = defaultImage;
        }

        const replyMessage = `
- _*Nombre:*_ _${name}_ 👤
- _*Edad:* ${age}_ 🎂
- _*Registrado:*_ ${registrationStatus}
- _*ID:* ${registrationId}_ 🪪
- _*Rol:* ${role}_ 
- _*Pareja:*_ ${partnerInfo}
- _*Nivel:* ${level}_ 📈
- _*XP:* ${xp}/${xpForNextLevel}_ ✨
- _*Balance:* ${coin}_ 🪙
- _*Diamantes:* ${diamond}_ 💎 `;

        await conn.sendMessage(m.chat, {
            image: { url: profilePicUrl },
            caption: replyMessage,
            contextInfo: { mentionedJid: mentions }
        });
    }

    // --- LÓGICA DEL COMANDO .BALANCE (.BAL) ---
    else if (command === 'balance' || command === 'bal') {
        let targetUserJid = m.mentionedJid[0] || m.quoted?.sender || m.sender;
        let targetUserData = global.db.data.users[targetUserJid] || {};

        if (!targetUserData.registered) {
             return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no está registrado.`, m, {
                mentions: [targetUserJid]
            });
        }

        const coin = targetUserData.coin || 0;
        const diamond = targetUserData.diamond || 0;
        const xp = targetUserData.exp || 0;
        const name = targetUserData.name || `@${targetUserJid.split('@')[0]}`;
        const mentions = [targetUserJid];
        
        let replyMessage;
        if (targetUserJid === m.sender) {
            replyMessage = `
- _Tu saldo actual es de:_
- _*Monedas:* ${coin}_ 💰
- _*Diamantes:* ${diamond}_ 💎
- _*XP:* ${xp}_ ✨`;
        } else {
            replyMessage = `
- _El saldo de *${name}* es de:_
- _*Monedas:* ${coin}_ 💰
- _*Diamantes:* ${diamond}_ 💎
- _*XP:* ${xp}_ ✨`;
        }
        
        await conn.reply(m.chat, replyMessage, m, {
            mentions: mentions
        });
    }

    // --- LÓGICA DEL COMANDO .LEVEL (.LVL) ---
    else if (command === 'level' || command === 'lvl') {
        let targetUserJid = m.mentionedJid[0] || m.quoted?.sender || m.sender;
        let targetUserData = global.db.data.users[targetUserJid] || {};

        if (!targetUserData.registered) {
             return conn.reply(m.chat, `_*@${String(targetUserJid).split('@')[0]}* no está registrado.`, m, {
                mentions: [targetUserJid]
            });
        }
        
        const level = targetUserData.level || 0;
        const xp = targetUserData.exp || 0;
        const role = targetUserData.role || "Hetere 😴";
        const xpForNextLevel = (level + 1) * 1000;
        const xpRemaining = xpForNextLevel - xp;
        const name = targetUserData.name || `@${targetUserJid.split('@')[0]}`;
        
        const xpPercentage = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));
        const progressBar = "█".repeat(Math.floor(xpPercentage / 10)) + "░".repeat(10 - Math.floor(xpPercentage / 10));

        let replyMessage;
        let mentions = [targetUserJid];
        
        if (targetUserJid === m.sender) {
            replyMessage = `
- _Estadísticas de Nivel_ 📊
- _*Nivel:* ${level}_ 👤
- _*Rol:* ${role}_
- _*XP:* ${xp} / ${xpForNextLevel}_ ✨
- _*Progreso:* ${progressBar} ${xpPercentage}%_\n\n_Te falta *${xpRemaining}* XP para el nivel *${level + 1}*._ ⚡`;
        } else {
            replyMessage = `
- _Estadísticas de Nivel de *${name}*_ 📊
- _*Nivel:* ${level}_ 👤
- _*Rol:* ${role}_
- _*XP:* ${xp} / ${xpForNextLevel}_ ✨
- _*Progreso:* ${progressBar} ${xpPercentage}%_\n\n_Le falta *${xpRemaining}* XP para el nivel *${level + 1}*._ ⚡`;
        }

        return conn.reply(m.chat, replyMessage, m, {
            mentions: mentions
        });
    }
};

handler.help = ['profile', 'perfil', 'balance', 'bal', 'level', 'lvl'];
handler.tags = ['economía'];
handler.command = ['profile', 'perfil', 'balance', 'bal', 'level', 'lvl'];

export default handler;
