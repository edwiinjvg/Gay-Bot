// Archivo: juegos-pareja.js

// Estado temporal para las propuestas pendientes
// La clave es el JID de la persona que propone
const pendingProposals = new Map();

let handler = async (m, { conn, usedPrefix, command, args, groupMetadata, isGroup }) => {

    if (!isGroup) {
        return m.reply('_Este comando solo puede ser utilizado en grupos._');
    }

    // Lógica para 'proponer'
    if (['pareja', 'proponer'].includes(command)) {
        
        let user = global.db.data.users[m.sender];
        if (user && user.marry) {
            const partnerJid = user.marry;
            const partnerNumber = partnerJid.split('@')[0];
            return m.reply(`_Ya tienes pareja, infiel de mierda._ 💔\n\n@${partnerNumber} es tu pareja.`, null, { mentions: [partnerJid] });
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
                return m.reply(`_Ya hay una propuesta pendiente entre ${mentionedProposer} y ${mentionedTarget}.`);
            }
        }
        
        // Agregar propuesta al estado
        pendingProposals.set(m.sender, {
            proposer: m.sender,
            target: targetUserJid,
            timestamp: Date.now()
        });

        const mentionProposer = `@${m.sender.split('@')[0]}`;
        const mentionTarget = `@${targetUserJid.split('@')[0]}`;
        const replyMessage = `_*${mentionProposer}* le propuso a ${mentionTarget} ser su pareja._ 💕\n\n_*${mentionTarget}*, tienes 1 minuto para aceptar con *${usedPrefix}aceptar* o rechazar con *${usedPrefix}rechazar*._`;
        
        // Temporizador para que la propuesta caduque
        setTimeout(() => {
            if (pendingProposals.has(m.sender) && pendingProposals.get(m.sender).target === targetUserJid) {
                pendingProposals.delete(m.sender);
                conn.reply(m.chat, `_La propuesta de ${mentionProposer} a ${mentionTarget} ha caducado porque no respondió a tiempo._ ⏰`, m, { mentions: [m.sender, targetUserJid] });
            }
        }, 60 * 1000); // 1 minuto

        await conn.reply(m.chat, replyMessage, m, { mentions: [m.sender, targetUserJid] });

    // Lógica para 'aceptar'
    } else if (command === 'aceptar') {

        const proposal = Array.from(pendingProposals.values()).find(
            p => p.target === m.sender
        );

        if (!proposal) {
            return m.reply('_No tienes ninguna propuesta de pareja pendiente._ 🥺');
        }
        
        const now = Date.now();
        if (now - proposal.timestamp > 60 * 1000) {
            pendingProposals.delete(proposal.proposer);
            return m.reply('_La propuesta de pareja ha caducado._ ⏰');
        }

        const proposerJid = proposal.proposer;
        
        // Asignar pareja en la base de datos de ambos
        global.db.data.users[m.sender].marry = proposerJid;
        global.db.data.users[proposerJid].marry = m.sender;
        
        // Eliminar propuesta del estado
        pendingProposals.delete(proposerJid);
        
        const mentionProposer = `@${proposerJid.split('@')[0]}`;
        const mentionTarget = `@${m.sender.split('@')[0]}`;
        const replyMessage = `_¡Felicidades!_ 🎉\n_*${mentionTarget}* aceptó la propuesta de *${mentionProposer}*. Ahora son pareja._ 💕`;
        await conn.reply(m.chat, replyMessage, m, { mentions: [proposerJid, m.sender] });

    // Lógica para 'rechazar'
    } else if (command === 'rechazar') {

        const proposal = Array.from(pendingProposals.values()).find(
            p => p.target === m.sender
        );

        if (!proposal) {
            return m.reply('_No tienes ninguna propuesta de pareja pendiente._ 🥺');
        }
        
        const now = Date.now();
        if (now - proposal.timestamp > 60 * 1000) {
            pendingProposals.delete(proposal.proposer);
            return m.reply('_La propuesta de pareja ha caducado._ ⏰');
        }
        
        const proposerJid = proposal.proposer;
        // Eliminar propuesta del estado
        pendingProposals.delete(proposerJid);
        
        const mentionProposer = `@${proposerJid.split('@')[0]}`;
        const mentionTarget = `@${m.sender.split('@')[0]}`;
        const replyMessage = `_*${mentionTarget}* rechazó la propuesta de *${mentionProposer}*._ 💔`;
        await conn.reply(m.chat, replyMessage, m, { mentions: [proposerJid, m.sender] });

    }
};

handler.help = ['pareja', 'proponer', 'aceptar', 'rechazar'];
handler.tags = ['juegos'];
handler.command = ['pareja', 'proponer', 'aceptar', 'rechazar'];
handler.group = true;

export default handler;
