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
    const jid = `${phone}@s.whatsapp.net`;
    const pairingCode = await sock.requestPairingCode(jid);
    res.json({ pairing_code: pairingCode });

    const timeout = setTimeout(() => {
      console.log(`⏱️ Pairing code for ${phone} expired.`);
      sock.end();
    }, 10 * 60 * 1000); // 10 minutes

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        clearTimeout(timeout);
        console.log('✅ Connected to WhatsApp:', phone);

        // 1. Zip session folder
        const zip = new AdmZip();
        zip.addLocalFolder(sessionFolder);
        zip.writeZip(zipPath);
        console.log(`Session zipped at: ${zipPath}`);

        // 2. Send zip file to the user
        const buffer = fs.readFileSync(zipPath);
        const mimeType = mime.lookup(zipPath);
        await sock.sendMessage(jid, {
          document: buffer,
          mimetype: mimeType,
          fileName: `${phone}-session.zip`,
          caption: `✅ Here is your session file for deployment on platforms like Render or Heroku.\n\nPlease save it securely.`
        });

        // 3. Send success text message
        await sock.sendMessage(jid, {
          text: `✅ Your device has been successfully linked to the bot!\n\nKeep your session file safe and do not share it with anyone.`
        });

        // 4. Send spd.mp3
        const audioPath = path.join(__dirname, 'public', 'spd.mp3');
        if (fs.existsSync(audioPath)) {
          const audioBuffer = fs.readFileSync(audioPath);
          await sock.sendMessage(jid, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: true
          });
          console.log('✅ Sent spd.mp3 to:', phone);
        } else {
          console.warn('⚠️ spd.mp3 not found in public folder!');
        }
      }

      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log('❌ Connection closed:', reason);
      }
    });

    sock.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error('❌ Failed to generate pairing code:', error);
    res.status(500).json({ error: 'Failed to generate pairing code' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
