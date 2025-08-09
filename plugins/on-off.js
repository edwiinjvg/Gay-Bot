import fetch from 'node-fetch'

let linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i
let linkRegex1 = /whatsapp\.com\/channel\/[0-9A-Za-z]{20,24}/i
const defaultImage = 'https://files.catbox.moe/ubftco.jpg'

async function isAdminOrOwner(m, conn) {
  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(p => p.id === m.sender)
    return participant?.admin || m.fromMe
  } catch {
    return false
  }
}

const handler = async (m, { conn, command, args, isAdmin, isOwner, usedPrefix }) => {
  if (!m.isGroup) return m.reply('🔒 Solo funciona en grupos.')
  if (!(isAdmin || isOwner)) return m.reply('❌ Solo admins pueden activar o desactivar funciones.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  // Lista consolidada de todas las variables que se pueden cambiar
  const allowedVariables = [
    'antilink', 'welcome', 'antiarabe', 'modoadmin', 'autolevelup', 
    'autosticker', 'autoresponder', 'detect', 'antiBot', 'antiBot2', 
    'reaction', 'nsfw', 'antifake', 'delete'
  ];

  // Si no se especifica una variable, mostrar el menú
  if (!type) {
    let menuText = `
*⚙️ Menú de Configuración de Grupo ⚙️*
_Usa ${usedPrefix}on <opción> o ${usedPrefix}off <opción> para cambiar el estado._
------------------------------------------
`.trim();

    for (const variable of allowedVariables) {
      const status = chat[variable] ? '✅ Activado' : '❌ Desactivado';
      menuText += `\n*${variable}:* ${status}`;
    }

    return m.reply(menuText);
  }
  
  // Verificar si la variable está en la lista de permitidas
  if (!allowedVariables.includes(type)) {
    return m.reply(`La variable *"${type}"* no existe o no se puede modificar.\n\nVariables disponibles:\n- ${allowedVariables.join('\n- ')}`);
  }

  // Verificar si la configuración ya está en el estado deseado
  if (chat[type] === enable) {
    return m.reply(`La opción *"${type}"* ya está ${enable ? 'activada' : 'desactivada'}.`);
  }

  // Cambiar el estado de la variable
  chat[type] = enable;
  m.reply(`✅ Se ha ${enable ? 'activado' : 'desactivado'} la opción *"${type}"* para este grupo.`);
}

handler.command = ['on', 'off']
handler.group = true
handler.register = true
handler.tags = ['group']
handler.help = ['on <opción>', 'off <opción>']

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  // MODO ADMIN
  if (chat.modoadmin) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    if (!isUserAdmin && !m.fromMe) return true // Ignora si no es admin ni owner
  }

  // ANTIARABE
  if (chat.antiarabe && m.messageStubType === 27) {
    const newJid = m.messageStubParameters?.[0]
    if (!newJid) return

    const number = newJid.split('@')[0].replace(/\D/g, '')
    const arabicPrefixes = ['212', '20', '971', '965', '966', '974', '973', '962']
    const isArab = arabicPrefixes.some(prefix => number.startsWith(prefix))

    if (isArab) {
      await conn.sendMessage(m.chat, { text: `Este pndj ${newJid} será expulsado, no queremos los العرب aca, adiosito. [ Anti Arabe Activado ]` })
      await conn.groupParticipantsUpdate(m.chat, [newJid], 'remove')
      return true
    }
  }

  // ANTILINK
  if (chat.antilink) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const isUserAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    const text = m?.text || ''

    if (!isUserAdmin && (linkRegex.test(text) || linkRegex1.test(text))) {
      const userTag = `@${m.sender.split('@')[0]}`
      const delet = m.key.participant
      const msgID = m.key.id

      try {
        const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (text.includes(ownGroupLink)) return
      } catch { }

      try {
        await conn.sendMessage(m.chat, {
          text: `🚫 Hey ${userTag}, no se permiten links aquí.`,
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
      } catch {
        await conn.sendMessage(m.chat, {
          text: `⚠️ No pude eliminar ni expulsar a ${userTag}. Puede que no tenga permisos.`,
          mentions: [m.sender]
        }, { quoted: m })
      }
      return true
    }
  }

  // WELCOME / BYE
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userMention = `@${userId.split('@')[0]}`
    let profilePic

    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      profilePic = defaultImage
    }

    if (m.messageStubType === 27) {
      const txtWelcome = '↷✦; w e l c o m e ❞'
      const bienvenida = `
✿ *Bienvenid@* a *${groupMetadata.subject}* ✰ ${userMention}, qué gusto :D 
✦ Ahora somos *${groupSize}*
`.trim()

      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: `${txtWelcome}\n\n${bienvenida}`,
        contextInfo: { mentionedJid: [userId] }
      })
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      const txtBye = '↷✦; b y e ❞'
      const despedida = `
✿ *Adiós* de *${groupMetadata.subject}* ✰ ${userMention}, vuelve pronto :>  
✦ Somos *${groupSize}* aún.  
`.trim()

      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: `${txtBye}\n\n${despedida}`,
        contextInfo: { mentionedJid: [userId] }
      })
    }
  }
}

export default handler
