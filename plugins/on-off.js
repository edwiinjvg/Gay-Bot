let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isOwner }) => {
    // Lista de variables que pueden ser activadas/desactivadas por los admins
    const allowedVariables = [
        'welcome', 'autolevelup', 'autosticker', 'autoresponder', 'detect', 'antiBot', 'antiBot2', 'modoadmin', 
        'antiLink', 'reaction', 'nsfw', 'antifake', 'delete'
    ];
    
    // El comando debe ser 'on' o 'off'
    if (!command.match(/on|off/i)) {
        return m.reply(`*Uso incorrecto.*\n\nEjemplo de uso:\n*${usedPrefix}on autolevelup*\n*${usedPrefix}off autolevelup*`);
    }

    // Si no se especifica una variable, mostrar el menú de opciones
    if (!text) {
        let chat = global.db.data.chats[m.chat];
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
    
    const variableName = text.trim().toLowerCase();
    
    // Verificar si la variable está en la lista de permitidas
    if (!allowedVariables.includes(variableName)) {
        return m.reply(`La variable *"${variableName}"* no existe o no se puede modificar.\n\nVariables disponibles:\n- ${allowedVariables.join('\n- ')}`);
    }

    // Verificar permisos de administrador
    if (!(isAdmin || isOwner)) {
        return m.reply('Este comando solo puede ser utilizado por administradores del grupo.');
    }
    
    let chat = global.db.data.chats[m.chat];
    const newValue = command.toLowerCase() === 'on';
    
    if (chat[variableName] === newValue) {
        return m.reply(`La opción *"${variableName}"* ya está ${newValue ? 'activada' : 'desactivada'}.`);
    }

    chat[variableName] = newValue;
    m.reply(`✅ Se ha ${newValue ? 'activado' : 'desactivado'} la opción *"${variableName}"* para este grupo.`);
};

handler.help = ['on <opción>', 'off <opción>'];
handler.tags = ['group', 'admin'];
handler.command = ['on', 'off'];
handler.group = true;
handler.admin = true;

export default handler;
