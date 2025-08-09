import fetch from 'node-fetch'

let linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
let linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Este comando no hace nada, la lógica está en handler.before
    // Lo creamos solo para que el plugin sea detectado
}

handler.before = async (m, { conn, isBotAdmin }) => {
    if (!m.isGroup) return
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    
    // Solo se ejecuta si la variable antilink está activada
    if (chat.antilink) {
        const groupMetadata = await conn.groupMetadata(m.chat)
        const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
        const text = m?.text || ''

        if (!isUserAdmin && (linkRegex.test(text) || linkRegex1.test(text))) {
            const userTag = `@${m.sender.split('@')[0]}`
            const delet = m.key.participant
            const msgID = m.key.id
            
            // Si el bot no es administrador, no puede expulsar
            if (!isBotAdmin) {
                await conn.sendMessage(m.chat, {
                    text: `_¡Necesito ser administrador para poder eliminar usuarios!_`,
                    mentions: [m.sender]
                }, { quoted: m })
                return
            }

            try {
                // Evita que el bot expulse si se envía el link del propio grupo
                const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
                if (text.includes(ownGroupLink)) return
            } catch { }
            
            try {
                await conn.sendMessage(m.chat, {
                    text: `_*{userTag}*,los links no están permitidos aquí._`,
                    mentions: [m.sender]
                }, { quoted: m })
        
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: msgID,
                        participant: delet
                    }
                })
        
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            } catch (e) {
                console.error(e)
                await conn.sendMessage(m.chat, {
                    text: `_No pude eliminar a *${userTag}*, ocurrió un error inesperado._`,
                    mentions: [m.sender]
                }, { quoted: m })
            }
            return true
        }
    }
}

export default handler
