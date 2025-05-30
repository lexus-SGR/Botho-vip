// loveness-cybermqui WhatsApp Bot - Full index.js

import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } from '@whiskeysockets/baileys'; import { Boom } from '@hapi/boom'; import fs from 'fs'; import pino from 'pino'; import dotenv from 'dotenv'; import path from 'path';

dotenv.config();

const prefix = '😁'; const ownerNumber = '255654478605'; const botName = 'loveness-cybermqui';

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) }); store.readFromFile('./baileys_store.json'); setInterval(() => store.writeToFile('./baileys_store.json'), 10000);

// Load commands dynamically from the commands folder const commands = new Map(); const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); for (const file of commandFiles) { const command = await import(./commands/${file}); commands.set(command.name, command.execute); }

const startSock = async () => { const { state, saveCreds } = await useMultiFileAuthState('./auth'); const { version } = await fetchLatestBaileysVersion(); const sock = makeWASocket({ version, auth: state, printQRInTerminal: true, logger: pino({ level: 'silent' }), browser: ['Loveness-Cybermqui', 'Safari', '1.0'] });

store.bind(sock.ev);

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', (update) => { const { connection, lastDisconnect } = update; if (connection === 'close') { const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startSock(); } else if (connection === 'open') { console.log('✅ Connected to WhatsApp'); } });

sock.ev.on('group-participants.update', async (update) => { const metadata = await sock.groupMetadata(update.id); const name = metadata.subject; for (const participant of update.participants) { if (update.action === 'add') { await sock.sendMessage(update.id, { text: 👋 Welcome @${participant.split('@')[0]} to *${name}*!, mentions: [participant] }); } else if (update.action === 'remove') { await sock.sendMessage(update.id, { text: 😢 Goodbye @${participant.split('@')[0]}!, mentions: [participant] }); } } });

sock.ev.on('messages.upsert', async ({ messages }) => { const msg = messages[0]; if (!msg.message || msg.key.fromMe) return; const from = msg.key.remoteJid; const type = Object.keys(msg.message)[0]; const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''; const isGroup = from.endsWith('@g.us'); const sender = isGroup ? msg.key.participant : from;

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

// Antilink in group
if (isGroup && body.includes('https://chat.whatsapp.com/')) {
  const groupMetadata = await sock.groupMetadata(from);
  const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
  if (!isAdmin) {
    await sock.sendMessage(from, { text: '🚫 WhatsApp group link is not allowed here.' }, { quoted: msg });
    await sock.groupParticipantsUpdate(from, [sender], 'remove');
  }
}

// Commands
if (body.startsWith(prefix)) {
  const commandName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
  const args = body.slice(prefix.length + commandName.length).trim().split(/ +/);

  // Fake presence recording
  await sock.sendPresenceUpdate('recording', from);

  // Execute command if exists
  if (commands.has(commandName)) {
    try {
      await commands.get(commandName)(sock, msg, args, { from, sender, isGroup });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: '❌ Error executing command.' }, { quoted: msg });
    }
  } else {
    await sock.sendMessage(from, { text: `❓ Unknown command. Use ${prefix}menu to view available commands.` }, { quoted: msg });
  }
}

}); };

startSock();

