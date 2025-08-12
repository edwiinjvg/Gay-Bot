// Archivo: juegos-pareja.js

// Estado temporal para las propuestas pendientes
const pendingProposals = new Map();

let handler = async (m, { conn, usedPrefix, command, args, groupMetadata }) => {

    const isGroup = m.chat.endsWith('@g.us');
    if (!isGroup) {
        if (['pareja', 'proponer', 'aceptar', 'rechazar', 'terminar', 'romper', 'mipareja'].includes(command)) {
            return m.reply('_Este comando solo puede ser utilizado en grupos._');
        }
    }

    // Asegurarse de que el usuario proponente esté registrado
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
    global.db.data.users[m.sender].marry = global.db.data.users[m.sender].marry || null;

    // Lógica para 'proponer'
    if (['pareja', 'proponer'].includes(command)) {

        if (global.db.data.users[m.sender].marry) {
            const partnerJid = global.db.data.users[m.sender].marry;
            const partnerNumber = partnerJid.split('@')[0];
            return m.reply(`_Ya tienes pareja, infiel de mierda._ 💔\n_*@${partnerNumber}* date cuenta._`, null, { mentions: [partnerJid] });
        }

        let targetUserJid;
        if (m.mentionedJid && m.mentionedJid[0]) {
            targetUserJid = m.mentionedJid[0];
        } else if (m.quoted) {
            targetUserJid = m.quoted.sender;
        } else {
            return m.reply('_Menciona a un usuario o responde su mensaje para proponerle ser tu pareja._');
        }

        if (targetUserJid === m.sender) {
            return m.reply('_No puedes hacerte pareja de ti mismo, eso sería raro..._ 💀');
        }

        // Asegurarse de que el usuario objetivo también esté registrado
        global.db.data.users[targetUserJid] = global.db.data.users[targetUserJid] || {};
        global.db.data.users[targetUserJid].marry = global.db.data.users[targetUserJid].marry || null;

        if (global.db.data.users[targetUserJid].marry) {
             const partnerJid = global.db.data.users[targetUserJid].marry;
             const partnerNumber = partnerJid.split('@')[0];
             return m.reply(`_Esa persona ya tiene pareja. No puedes robarle la pareja a @${partnerNumber}._ 💔`, null, { mentions: [targetUserJid, partnerJid] });
        }

        const existingProposal = Array.from(pendingProposals.values()).find(
            p => p.proposer === m.sender || p.target === m.sender || p.proposer === targetUserJid || p.target === targetUserJid
        );

        if (existingProposal) {
            const mentionedProposer = `@${existingProposal.proposer.split('@')[0]}`;
            const mentionedTarget = `@${existingProposal.target.split('@')[0]}`;
            if (existingProposal.proposer === m.sender) {
                return m.reply(`_Ya tienes una propuesta pendiente para ${mentionedTarget}, aún no ha respondido._`);
            } else if (existingProposal.target === m.sender) {
                return m.reply(`_Ya tienes una propuesta pendiente de ${mentionedProposer}, aún no has respondido._`);
            } else {
                return m.reply(`_Ya hay una propuesta pendiente entre ${mentionedProposer} y ${mentionedTarget}._`);
            }
        }
        
        pendingProposals.set(m.sender, {
            proposer: m.sender,
            target: targetUserJid,
            timestamp: Date.now()
        });

        const mentionProposer = `@${m.sender.split('@')[0]}`;
        const mentionTarget = `@${targetUserJid.split('@')[0]}`;
        const replyMessage = `_*${mentionProposer}* le propuso a ${mentionTarget} ser su pareja._ 💕\n\n_*${mentionTarget}*, tienes 1 minuto para aceptar con *${usedPrefix}aceptar* o rechazar con *${usedPrefix}rechazar*._`;
        
        setTimeout(() => {
            if (pendingProposals.has(m.sender) && pendingProposals.get(m.sender).target === targetUserJid) {
                pendingProposals.delete(m.sender);
                conn.reply(m.chat, `_La propuesta de ${mentionProposer} a ${mentionTarget} ha caducado porque no respondió a tiempo._ ⏰`, m, { mentions: [m.sender, targetUserJid] });
            }
        }, 60 * 1000);

        await conn.reply(m.chat, replyMessage, m, { mentions: [m.sender, targetUserJid] });

    // Lógica para 'aceptar'
    } else if (command === 'aceptar') {
        const proposal = Array.from(pendingProposals.values()).find(p => p.target === m.sender);
        if (!proposal) {
            return m.reply('_No tienes ninguna propuesta de pareja pendiente._ 🥺');
        }
        
        const now = Date.now();
        if (now - proposal.timestamp > 60 * 1000) {
            pendingProposals.delete(proposal.proposer);
            return m.reply('_La propuesta de pareja ha caducado._ ⏰');
        }

        const proposerJid = proposal.proposer;
        
        global.db.data.users[m.sender].marry = proposerJid;
        global.db.data.users[proposerJid].marry = m.sender;
        
        pendingProposals.delete(proposerJid);
        
        const mentionProposer = `@${proposerJid.split('@')[0]}`;
        const mentionTarget = `@${m.sender.split('@')[0]}`;
        const replyMessage = `_¡Felicidades!_ 🎉\n_*${mentionTarget}* aceptó la propuesta de *${mentionProposer}*. Ahora son pareja._ 💕`;
        await conn.reply(m.chat, replyMessage, m, { mentions: [proposerJid, m.sender] });

    // Lógica para 'rechazar'
    } else if (command === 'rechazar') {
        const proposal = Array.from(pendingProposals.values()).find(p => p.target === m.sender);

        if (!proposal) {
            return m.reply('_No tienes ninguna propuesta de pareja pendiente._ 🥺');
        }
        
        const now = Date.now();
        if (now - proposal.timestamp > 60 * 1000) {
            pendingProposals.delete(proposal.proposer);
            return m.reply('_La propuesta de pareja ha caducado._ ⏰');
        }
        
        const proposerJid = proposal.proposer;
        pendingProposals.delete(proposerJid);
        
        const mentionProposer = `@${proposerJid.split('@')[0]}`;
        const mentionTarget = `@${m.sender.split('@')[0]}`;
        const replyMessage = `_*${mentionTarget}* rechazó la propuesta de *${mentionProposer}*._ 💔`;
        await conn.reply(m.chat, replyMessage, m, { mentions: [proposerJid, m.sender] });

    // Lógica para 'terminar'
    } else if (['terminar', 'romper'].includes(command)) {
        if (!global.db.data.users[m.sender].marry) {
            return m.reply("_No tienes pareja como para terminar una relación, perdedor._ 😹");
        }

        const partnerJid = global.db.data.users[m.sender].marry;
        if (global.db.data.users[partnerJid]) {
            global.db.data.users[partnerJid].marry = null;
        }
        global.db.data.users[m.sender].marry = null;
        
        const mentionUser = `@${m.sender.split('@')[0]}`;
        const mentionPartner = `@${partnerJid.split('@')[0]}`;

        await conn.reply(m.chat, `_*${mentionUser}* terminó con *${mentionPartner}*._ 💔`, m, {
            mentions: [m.sender, partnerJid]
        });

    // Lógica para 'mipareja'
    } else if (command === 'mipareja') {
        if (global.db.data.users[m.sender].marry) {
            const partnerJid = global.db.data.users[m.sender].marry;
            const mention = `@${partnerJid.split('@')[0]}`;
            await conn.reply(m.chat, `_Tu pareja es ${mention}._ 💕`, m, {
                mentions: [partnerJid]
            });
        } else {
            await conn.reply(m.chat, "_No tienes pareja, perdedor._ 😹", m);
        }
    }
};

handler.help = ['pareja', 'proponer', 'aceptar', 'rechazar', 'terminar', 'romper', 'mipareja'];
handler.tags = ['juegos'];
handler.command = ['pareja', 'proponer', 'aceptar', 'rechazar', 'terminar', 'romper', 'mipareja'];
handler.group = true;

export default handler;
