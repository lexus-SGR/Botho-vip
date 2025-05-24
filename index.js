require('dotenv').config(); // Load env variables

const express = require('express');
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OWNER_JID = `${process.env.OWNER}@s.whatsapp.net`;

app.use(express.json());
app.use(express.static('public'));

const commands = new Map();
const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
  for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
    const command = require(path.join(commandsPath, file));
    if (command.name) {
      commands.set(command.name.toLowerCase(), command);
      console.log(`Loaded command: ${command.name}`);
    }
  }
} else {
  fs.mkdirSync(commandsPath);
  console.log('Created commands folder.');
}

app.post('/pair', async (req, res) => {
  const phone = req.body.phone;
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  const sessionFolder = `sessions/${phone}`;
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, fs)
    },
    printQRInTerminal: false,
    browser: ['Ben Whittaker Bot', 'Safari', '1.0.0']
  });

  sock.ev.once('connection.update', async (update) => {
    const { pairingCode, connection, lastDisconnect } = update;

    if (pairingCode) {
      return res.json({ pairing_code: pairingCode });
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp:', phone);
      // You can send a message to the owner or save session here if needed
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log('Connection closed:', reason);
    }
  });

  sock.ev.on('creds.update', saveCreds);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
