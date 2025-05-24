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

    // Tuma pairing notification message
    const jid = `${phone}@s.whatsapp.net`;
    await sock.sendMessage(jid, {
      text:
`✅ Your 8-digit pairing code is ready.

Now open WhatsApp Messenger:
Go to ➤ Linked Devices > Link a Device
Then enter this code: *${pairingCode}*

⌛ You have 10 minutes before it expires.`
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        console.log('Connected to WhatsApp:', phone);

        // Zip session
        const zip = new AdmZip();
        zip.addLocalFolder(sessionFolder);
        zip.writeZip(zipPath);

        const buffer = fs.readFileSync(zipPath);
        const mimeType = mime.lookup(zipPath);

        // Tuma session file
        await sock.sendMessage(jid, {
          document: buffer,
          mimetype: mimeType,
          fileName: `${phone}-session.zip`,
          caption: `✅ This is your session file for Render/Heroku deployment.\n\nKeep it safe.`
        });

        // Optional: Tuma mp3 ya ushahidi
        const audioPath = path.join(__dirname, 'spd.mp3');
        if (fs.existsSync(audioPath)) {
          await sock.sendMessage(jid, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            ptt: false
          });
        }
      }

      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log('Connection closed:', reason);
      }
    });

    sock.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error('Failed to generate pairing code:', error);
    res.status(500).json({ error: 'Could not generate pairing code' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
