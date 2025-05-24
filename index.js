require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const mime = require('mime-types');
const { Boom } = require('@hapi/boom');

const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Optional: Load commands
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

// Pair route
app.post('/pair', async (req, res) => {
  const phone = req.body.phone;
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  const sessionFolder = `sessions/${phone}`;
  const zipPath = `sessions/${phone}.zip`;

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

  try {
    const pairingCode = await sock.requestPairingCode(`${phone}@s.whatsapp.net`);
    res.json({ pairing_code: pairingCode });

    // Wait for connection
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        console.log('Connected to WhatsApp:', phone);

        // 1. Zip session folder
        const zip = new AdmZip();
        zip.addLocalFolder(sessionFolder);
        zip.writeZip(zipPath);
        console.log(`Session zipped at: ${zipPath}`);

        // 2. Send zip file to the user via WhatsApp
        const jid = `${phone}@s.whatsapp.net`;
        const buffer = fs.readFileSync(zipPath);
        const mimeType = mime.lookup(zipPath);

        await sock.sendMessage(jid, {
          document: buffer,
          mimetype: mimeType,
          fileName: `${phone}-session.zip`,
          caption: `✅ Hii ni session yako kwa ajili ya deploy bot Render/Heroku.\n\nHifadhi hii file vizuri.`
        });

        console.log('Session file sent to:', phone);
      }

      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log('Connection closed:', reason);
      }
    });

    sock.ev.on('creds.update', saveCreds);
  } catch (error) {
    console.error('Failed to generate pairing code:', error);
    res.status(500).json({ error: 'Failed to generate pairing code' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
