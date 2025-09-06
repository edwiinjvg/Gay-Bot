process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import fs from 'fs'
import { exec } from 'child_process' // Importar 'exec' para la limpieza
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb'
import lodash from 'lodash'
import readline from 'readline'
import NodeCache from 'node-cache'
import qrcode from 'qrcode-terminal'
import { spawn } from 'child_process'
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import yargs from 'yargs'
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'


const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = await import('@whiskeysockets/baileys');

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}),
        })
      )
    : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
);

global.db = new Low(new JSONFile(`storage/databases/database.json`));

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = lodash.chain(global.db.data);
};

global.authFile = `sessions`;
const { state, saveCreds } = await useMultiFileAuthState(global.authFile);

const { version } = await fetchLatestBaileysVersion();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: 'client' });
logger.level = 'fatal';

const connectionOptions = {
  version: version,
  logger,
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  browser: Browsers.ubuntu('Chrome'),
  markOnlineOnclientect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  retryRequestDelayMs: 10,
  transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
  maxMsgRetryCount: 15,
  appStateMacVerification: {
    patch: false,
    snapshot: false,
  },
  getMessage: async (key) => {
    const jid = jidNormalizedUser(key.remoteJid);
    return '';
  },
};

global.conn = makeWASocket(connectionOptions);

// Se importa el handler de forma segura y se almacena en una variable global.
import { handler } from './handler.js';

async function handleLogin() {
  if (global.conn.authState.creds.registered) {
    console.log(chalk.green('Sesión principal ya registrada.'));
    return;
  }

  let loginMethod = await question(
    chalk.green(
      `¡Bienvenido!\n` +
      `Escribe "code" para iniciar..\n` +
      `> `
    )
  );

  loginMethod = loginMethod.toLowerCase().trim();

  if (loginMethod === 'code') {
    let phoneNumber = await question(chalk.red('Ingresa el número de WhatsApp donde estará el bot (incluye código país, ej: 571XXXXXXXXXX):\n'));
    phoneNumber = phoneNumber.replace(/\D/g, '');

    if (phoneNumber.startsWith('52') && phoneNumber.length === 12) {
      phoneNumber = `521${phoneNumber.slice(2)}`;
    } else if (phoneNumber.startsWith('52') && phoneNumber.length === 10) {
      phoneNumber = `521${phoneNumber.slice(2)}`;
    } else if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.replace(/^0/, '');
    }

    if (typeof global.conn.requestPairingCode === 'function') {
      try {
        if (global.conn.ws.readyState === ws.OPEN) {
          let code = await global.conn.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join('-') || code;
          console.log(chalk.cyan('Tu código de emparejamiento es:', code));
        } else {
          console.log(chalk.red('La conexión principal no está abierta. Intenta nuevamente.'));
        }
      } catch (e) {
        console.log(chalk.red('Error al solicitar código de emparejamiento:'), e.message || e);
      }
    } else {
      console.log(chalk.red('Tu versión de Baileys no soporta emparejamiento por código.'));
    }
  } else {
    console.log(chalk.yellow('Generando código QR, escanéalo con tu WhatsApp...'));
    global.conn.ev.on('connection.update', ({ qr }) => {
      if (qr) qrcode.generate(qr, { small: true });
    });
  }
}

await handleLogin();

global.conn.isInit = false;
global.conn.well = false;

// Nuevo código para la cola de escritura
global.db.writeQueue = new Set();
let isWriting = false;

setInterval(async () => {
    if (global.db.writeQueue.size === 0 || isWriting) {
        return;
    }

    isWriting = true;
    try {
        await global.db.write();
        console.log(chalk.green(`✓ Base de datos guardada. Se actualizaron los datos de ${global.db.writeQueue.size} usuarios.`));
        global.db.writeQueue.clear();
    } catch (error) {
        console.error(chalk.red('✗ Error al guardar la base de datos:', error));
    } finally {
        isWriting = false;
    }
}, 30 * 1000); // Se sigue ejecutando cada 30 segundos, pero de forma más eficiente.

// El código para la limpieza de archivos temporales se mantiene igual
if (!global.opts['test']) {
  if (global.db) {
    setInterval(() => {
        if (global.opts['autocleartmp']) {
            const tmp = [tmpdir(), 'tmp', 'serbot'];
            tmp.forEach((dir) => {
                exec(`find "${dir}" -amin 3 -type f -delete`, (err) => {
                    if (err) console.error(`Error en la limpieza: ${err.message}`);
                });
            });
        }
    }, 30 * 1000);
  }
}

function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 3) return unlinkSync(file);
    return false;
  });
}

setInterval(() => {
  if (global.stopped === 'close' || !global.conn || !global.conn.user) return;
  clearTmp();
}, 180000);

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) global.conn.isInit = true;
  const code =
    lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && global.conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }
  if (global.db.data == null) await loadDatabase();
  if (connection === 'open') {
    console.log(chalk.yellow('Conectado correctamente el bot principal.'));
  }
  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (reason === 405) {
    if (existsSync('./sessions/creds.json')) unlinkSync('./sessions/creds.json');
    console.log(
      chalk.bold.redBright(
        `Conexión reemplazada para el bot principal, por favor espera un momento. Reiniciando...\nSi aparecen errores, vuelve a iniciar con: npm start`
      )
    );
    process.send('reset');
  }
  if (connection === 'close') {
    switch (reason) {
      case DisconnectReason.badSession:
        global.conn.logger.error(`Sesión principal incorrecta, elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.timedOut:
        global.conn.logger.warn(`Conexión principal perdida o cerrada, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
        break;
      case DisconnectReason.connectionReplaced:
        global.conn.logger.error(
          `Conexión principal reemplazada, se abrió otra sesión. Cierra esta sesión primero.`
        );
        break;
      case DisconnectReason.loggedOut:
        global.conn.logger.error(`Sesión principal cerrada, elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        break;
      case DisconnectReason.restartRequired:
        global.conn.logger.info(`Reinicio necesario del bot principal, reinicia el servidor si hay problemas.`);
        await global.reloadHandler(true).catch(console.error);
        break;
      default:
        global.conn.logger.warn(`Desconexión desconocida del bot principal: ${reason || ''} - Estado: ${connection || ''}`);
        await global.reloadHandler(true).catch(console.error);
        break;
    }
  }
}

process.on('uncaughtException', console.error);

let isInit = true;

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    // Aseguramos que la variable 'handler' global se actualice correctamente
    if (Handler && Handler.handler) global.handler = Handler.handler;
  } catch (e) {
    console.error(`[ERROR] Fallo al cargar handler.js: ${e}`);
  }

  if (restartConn) {
    try {
      if (global.conn.ws) global.conn.ws.close();
    } catch {}
    global.conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions);
    isInit = true;
  }

  if (!isInit) {
    global.conn.ev.off('messages.upsert', global.conn.handler);
    global.conn.ev.off('connection.update', global.conn.connectionUpdate);
    global.conn.ev.off('creds.update', global.conn.credsUpdate);
  }

  global.conn.handler = handler.bind(global.conn);
  global.conn.connectionUpdate = connectionUpdate.bind(global.conn);
  global.conn.credsUpdate = saveCreds.bind(global.conn, true);

  global.conn.ev.on('messages.upsert', global.conn.handler);
  global.conn.ev.on('connection.update', global.conn.connectionUpdate);
  global.conn.ev.on('creds.update', global.conn.credsUpdate);

  isInit = false;
  return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      global.conn.logger.error(`Error al cargar el plugin '${filename}': ${e}`);
      delete global.plugins[filename];
    }
  }
}
await filesInit();

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) global.conn.logger.info(`Updated plugin - '${filename}'`);
      else {
        global.conn.logger.warn(`Deleted plugin - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else global.conn.logger.info(`New plugin - '${filename}'`);

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) global.conn.logger.error(`Syntax error while loading '${filename}':\n${format(err)}`);
    else {
      try {
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
        global.plugins[filename] = module.default || module;
      } catch (e) {
        global.conn.logger.error(`Error requiring plugin '${filename}':\n${format(e)}`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);

watch(pluginFolder, global.reload);
await global.reloadHandler();
