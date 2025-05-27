import express from 'express';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { useMultiFileAuthState, makeWASocket, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/generate-session', async (req, res) => {
  const number = req.body.number;
  if (!number) return res.send('Number required');

  const { state, saveCreds } = await useMultiFileAuthState(`./session-${number}`);
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;
    if (pairingCode) {
      fs.writeFileSync(`./public/${number}-pair.txt`, `Pairing Code: ${pairingCode}`);
    }
    if (connection === 'open') {
      await saveCreds();
      sock.sendMessage(`${number}@s.whatsapp.net`, {
        document: fs.readFileSync(`./session-${number}/creds.json`),
        fileName: 'session.json',
        mimetype: 'application/json'
      });
    }
  });

  res.send(`Pairing Code sent to public/${number}-pair.txt`);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
