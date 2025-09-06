import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import { xpRange, findLevel, canLevelUp } from './lib/levelling.js'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

const XP_PER_COMMAND = 250;
const ROLES = {
    5: "Penelover 💜",
    10: "Furry 🐾",
    25: "Femboy 👯‍♂️",
    50: "Gay 🏳️‍🌈",
    75: "Trans 🏳️‍⚧️",
    100: "Género fluido 👰🏻‍♂️",
};

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return;
    if (global.db.data == null) await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m) return
        m.exp = 0
        m.gaycoin = false
        try {
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.gaycoin)) user.gaycoin = 500
                if (!isNumber(user.diamond)) user.diamond = 50
                if (!isNumber(user.lastclaim)) user.lastclaim = 0
                if (!isNumber(user.lastmining)) user.lastmining = 0
                if (!('mute' in user)) user.mute = false
                if (!('premium' in user)) user.premium = false
                if (!user.premium) user.premiumTime = 0
                if (!('registered' in user)) user.registered = false
                if (!('description' in user)) user.description = ''
                if (!user.registered) {
                    if (!('name' in user)) user.name = m.name
                    if (!isNumber(user.age)) user.age = -1
                    if (!isNumber(user.regtime)) user.regtime = -1
                }
                if (!isNumber(user.afk)) user.afk = -1
                if (!('afkreason' in user)) user.afkreason = ''
                if (!('role' in user)) user.role = 'Hetere 😴'
                if (!('banned' in user)) user.banned = false
                if (!isNumber(user.level)) user.level = 0
                if (!isNumber(user.bank)) user.bank = 0
                if (!isNumber(user.warn)) user.warn = 0
            } else
                global.db.data.users[m.sender] = {
                    exp: 0,
                    gaycoin: 500,
                    diamond: 50,
                    lastclaim: 0,
                    lastmining: 0,
                    mute: false,
                    registered: false,
                    description: '',
                    name: m.name,
                    age: -1,
                    regtime: -1,
                    afk: -1,
                    afkreason: '',
                    banned: false,
                    bank: 0,
                    level: 0,
                    role: 'Hetere 😴',
                    premium: false,
                    premiumTime: 0,
                }
            
            // Añade esta línea para registrar cambios en el usuario
            if (global.db.writeQueue) {
                global.db.writeQueue.add(m.sender);
            }

            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('welcome' in chat)) chat.welcome = true
                if (!('autolevelup' in chat)) chat.autolevelup = false
                if (!('detect' in chat)) chat.detect = false
                if (!('antibot' in chat)) chat.antibot = false
                if (!('onlyadmin' in chat)) chat.onlyadmin = false
                if (!('antilink' in chat)) chat.antilink = true
                if (!('reaction' in chat)) chat.reaction = true
                if (!('nsfw' in chat)) chat.nsfw = false
                if (!('antifake' in chat)) chat.antifake = false
                if (!('delete' in chat)) chat.delete = false
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: true,
                    autolevelup: false,
                    delete: false,
                    detect: false,
                    antibot: false,
                    onlyadmin: false,
                    antilink: true,
                    antifake: false,
                    reaction: false,
                    nsfw: false,
                }
            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('restrict' in settings)) settings.restrict = true
                if (!('antiprivate' in settings)) settings.antiprivate = false
                if (!('autoread' in settings)) settings.autoread = false
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                restrict: false,
                antiprivate: false,
                autoread: false,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isOwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
        const isPrems = isOwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || _user.premium == true

        if (m.isBaileys) return
        if (opts['nyimak']) return
        if (!isOwner && opts['self']) return
        if (opts['swonly'] && m.chat !== 'status@broadcast') return
        if (typeof m.text !== 'string') m.text = ''
        if (m.isGroup) {
            let chat = global.db.data.chats[m.chat];
            if (chat?.primaryBot && this?.user?.jid !== chat.primaryBot) {
                return;
            }
        }
        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque,
                time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }
        async function getLidFromJid(id, conn) {
            if (id.endsWith('@lid')) return id
            const res = await conn.onWhatsApp(id).catch(() => [])
            return res[0]?.lid || id
        }
        const senderLid = await getLidFromJid(m.sender, conn)
        const botLid = await getLidFromJid(conn.user.jid, conn)
        const senderJid = m.sender
        const botJid = conn.user.jid
        const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
        const participants = m.isGroup ? (groupMetadata.participants || []) : []
        const user = participants.find(p => p.id === senderLid || p.id === senderJid) || {}
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
        const isAdmin = user?.admin === "admin"
        const isBotAdmin = !!bot?.admin
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        let usedPrefix = '';

        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin) continue
            if (plugin.disabled) continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isOwner,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })) continue
            }
            if (typeof plugin !== 'function') continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false

                global.comando = command
                if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return
                if (!isAccept) continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'grupo-unbanchat.js' && chat?.isBanned) return
                    if (name != 'owner-unbanuser.js' && user?.banned) return
                }

                let adminMode = global.db.data.chats[m.chat].onlyadmin
                let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || usedPrefix || m.text.slice(0, 1) == usedPrefix || plugins.command}`
                if (adminMode && !isOwner && m.isGroup && !isAdmin && mini) return
                if (plugin.owner && !isOwner) {
                    fail('owner', m, this, usedPrefix, command)
                    continue
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, this, usedPrefix, command)
                    continue
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this, usedPrefix, command)
                    continue
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, this, usedPrefix, command)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, this, usedPrefix, command)
                    continue
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, this, usedPrefix, command)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this, usedPrefix, command)
                    continue
                }
                if (plugin.register == true && _user.registered == false) {
                    fail('unreg', m, this, usedPrefix, command)
                    continue
                }

                if (m.sender && (_user = global.db.data.users[m.sender])) {
                    let oldLevel = _user.level;
                    _user.exp += XP_PER_COMMAND;

                    if (canLevelUp(oldLevel, _user.exp)) {
                        let newLevel = findLevel(_user.exp);
                        _user.level = newLevel;
                        let newRole = ROLES[newLevel];
                        if (newRole) {
                            _user.role = newRole;
                        }
                        if (m.isGroup && global.db.data.chats[m.chat].autolevelup) {
                            let text = `_¡Felicidades, *@${m.sender.split('@')[0]}* subiste al nivel *${newLevel}*!_ 🥳`;
                            if (newRole) {
                                text += `\n_Alcanzaste el rol de *${newRole}*._`;
                            }
                            await conn.reply(m.chat, text, m, {
                                mentions: [m.sender]
                            });
                        }
                    }
                    // Añade esta línea para registrar cambios en el usuario
                    if (global.db.writeQueue) {
                        global.db.writeQueue.add(m.sender);
                    }
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10
                m.exp += xp
                if (!isPrems && plugin.gaycoin && global.db.data.users[m.sender].gaycoin < plugin.gaycoin * 1) {
                    conn.reply(m.chat, `_¡Te quedaste sin ${moneda}!_`, m)
                    continue
                }
                if (plugin.level > _user.level) {
                    conn.reply(m.chat, `_Necesitas ser nivel: *${plugin.level}*_\n\n_Tu nivel actual es: *${_user.level}*_\n\n_Para subir de nivel usa:\n*${usedPrefix}levelup*_`, m)
                    continue
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isOwner,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems) m.gaycoin = m.gaycoin || plugin.gaycoin || false
                } catch (e) {
                    m.error = e
                    console.error(`[HANDLER ERROR] Plugin: ${name}, Command: ${command}, Error:`, e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), 'Administrador')
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.gaycoin) conn.reply(m.chat, `_ Gastaste *${+m.gaycoin}* *${moneda}*_`, m)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
        }
        let user, stats = global.db.data.stats
        if (m) {
            let utente = global.db.data.users[m.sender]
            if (utente.mute == true) {
                let bang = m.key.id
                let cancellazzione = m.key.participant
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: bang,
                        participant: cancellazzione
                    }
                })
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        let settingsREAD = global.db.data.settings[this.user.jid] || {}
        if (opts['autoread']) await this.readMessages([m.key])

        if (db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
            let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "🍆", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🏳️‍🌈", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
            if (!m.fromMe) return this.sendMessage(m.chat, {
                react: {
                    text: emot,
                    key: m.key
                }
            })
        }
        function pickRandom(list) {
            return list[Math.floor(Math.random() * list.length)]
        }
    }
}

global.dfail = (type, m, conn, usedPrefix, command) => {
    const msg = {
        owner: '_¡Solo mi creador puede utilizar este comando!_',
        mods: '_¡Solo los moderadores pueden utilizar este comando!_',
        premium: '_¡Solo usuarios Premium pueden utilizar este comando!_',
        group: '_¡Este comando es solo puede ser utilizado en grupos!_',
        private: '_¡Este comando solo puede ser utilizado en chats privados!_',
        admin: '_¡Este comando solo puede ser utilizado por administradores!_',
        botAdmin: '_¡Debo ser administrador para poder ejecutar este comando!_',
        unreg: '_¡Debes estar registrado para utilizar este comando!_',
        restrict: '_¡Esta función está deshabilitada!_'
    }[type];

    if (msg)
        return conn.reply(m.chat, msg, m, {
            contextInfo: rcanal
        }).then(() => conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        }))
}
