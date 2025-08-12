var handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `_Debes mencionar o responder a alguien para usar este comando._`, m);
  }

  if (isNaN(text)) {
    if (text.includes('@')) {
      number = text.split('@')[1];
    }
  } else {
    number = text;
  }

  if (!number && m.quoted) {
    number = m.quoted.sender.split('@')[0];
  }

  if (!number) {
    return conn.reply(m.chat, `_No encontré a nadie válido para procesar._`, m);
  }

  if (number.length > 13 || number.length < 10) {
    return conn.reply(m.chat, `_El número de teléfono no es válido._`, m);
  }

  let user = number + '@s.whatsapp.net';

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    conn.reply(m.chat, `_¡@${number} ha sido promovido a administrador!_`, m, { mentions: [user] });
  } catch (e) {
    conn.reply(m.chat, `_Ocurrió un error al intentar promover al usuario. ¿El bot es administrador?_`, m);
  }
};

handler.help = ['promote'];
handler.tags = ['grupo'];
handler.command = ['promote', 'admin', 'promover'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
