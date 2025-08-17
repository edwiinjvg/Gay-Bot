
import fetch from 'node-fetch'

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
  if (!m.isGroup) return m.reply('_¡Este comando solo puede ser utilizado en grupos!_')
  if (!(isAdmin || isOwner)) return m.reply('_¡Solo administradores pueden utilizar este comando!_')

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
  
  // Mapa de alias para las variables
  const variableAliases = {
    'modohorny': 'nsfw',
    'nivelup': 'autolevelup',
    'antifakes': 'antifake'
  };

  // Si no se especifica una variable, mostrar el menú con los alias
  if (!type) {
    let menuText = `
_Usa *${usedPrefix}on <opción>* o *${usedPrefix}off <opción>* para cambiar el estado._`.trim();

    for (const variable of allowedVariables) {
      const alias = Object.keys(variableAliases).find(key => variableAliases[key] === variable);
      const nameToShow = alias ? `${variable} (${alias})` : variable;
      const status = chat[variable] ? 'Activado ✅' : 'Desactivado ❌';
      menuText += `\n- _*${nameToShow}:* ${status}._`;
    }

    return m.reply(menuText);
  }
  
  const variableName = variableAliases[type] || type;

  if (!allowedVariables.includes(variableName)) {
    return m.reply(`La variable *"${type}"* no existe o no se puede modificar.\n\nVariables disponibles:\n- ${allowedVariables.join('\n- ')}`);
  }

  if (chat[variableName] === enable) {
    return m.reply(`_La opción *"${variableName}"* ya está ${enable ? 'activada' : 'desactivada'}_.`);
  }

  chat[variableName] = enable;
  m.reply(`_Se ${enable ? 'activó' : 'desactivó'} la opción *"${variableName}"* para este grupo._`);
}

handler.command = ['on', 'off']
handler.group = true
handler.register = false
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
    if (!isUserAdmin && !m.fromMe) return true
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
}

export default handler
