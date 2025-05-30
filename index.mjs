import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 100;

import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import P from 'pino';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore
} from '@whiskeysockets/baileys';

// Needed for resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express server (for Render/UptimeRobot/etc.)
const app = express();
app.get('/', (req, res) => res.send('Fatuma WhatsApp Bot is running!'));
app.listen(process.env.PORT || 3000, () =>
  console.log('Server running on port ' + (process.env.PORT || 3000))
);

// Bot configuration
const prefix = '😁';
const ownerNumber = '255654478605@s.whatsapp.net';
const botName = 'loveness-cybermqui';

const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });
store.readFromFile('./baileys_store.json');
setInterval(() => store.writeToFile('./baileys_store.json'), 10000);

// Load command files from /commands
const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const commandPath = path.resolve('./commands', file);
  const command = await import(`file://${commandPath}`);
  commands.set(command.default.name, command.default.execute);
}

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' }),
    browser: [botName, 'Safari', '1.0']
  });

  store.bind(sock.ev);
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startSock();
      else console.log('🔴 Connection closed. You are logged out.');
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp');
    }
  });

  sock.ev.on('group-participants.update', async (update) => {
    const metadata = await sock.groupMetadata(update.id);
    const name = metadata.subject;
    for (const participant of update.participants) {
      if (update.action === 'add') {
        await sock.sendMessage(update.id, { text: `👋 Welcome @${participant.split('@')[0]} to *${name}*`, mentions: [participant] });
      } else if (update.action === 'remove') {
        await sock.sendMessage(update.id, { text: `😢 Goodbye @${participant.split('@')[0]}!`, mentions: [participant] });
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : from;

    // Auto View Status
    if (from.includes('status@broadcast')) {
      await sock.readMessages([msg.key]);
    }

    // Auto ViewOnce Open & Resend
    if (type === 'viewOnceMessageV2') {
      const originalMsg = msg.message.viewOnceMessageV2.message;
      const mediaType = Object.keys(originalMsg)[0];
      await sock.sendMessage(from, { [mediaType]: originalMsg[mediaType] }, { quoted: msg });
    }

    // Anti-link in groups
    if (isGroup && body.includes('https://chat.whatsapp.com/')) {
      const groupMetadata = await sock.groupMetadata(from);
      const participant = groupMetadata.participants.find(p => p.id === sender);
      const isAdmin = participant?.admin || false;

      if (!isAdmin) {
        await sock.sendMessage(from, { text: '🚫 WhatsApp group link is not allowed here.' }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
      }
    }

    // Command handling
    if (body.startsWith(prefix)) {
      const commandName = body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase();
      const args = body.slice(prefix.length + commandName.length).trim().split(/ +/);

      // Fake presence recording
      await sock.sendPresenceUpdate('recording', from);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await sock.sendPresenceUpdate('paused', from);

      if (commands.has(commandName)) {
        try {
          await commands.get(commandName)(sock, msg, args, { from, sender, isGroup, prefix, ownerNumber, botName });
        } catch (err) {
          console.error('❌ Error executing command:', err);
          await sock.sendMessage(from, { text: '❌ Error executing command.' }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(from, { text: `❓ Unknown command. Use ${prefix}menu to view available commands.` }, { quoted: msg });
      }
    }
  });
};

startSock();
