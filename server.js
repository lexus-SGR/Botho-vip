const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Faili kuhifadhi paircodes na sessions
const pairCodesFile = path.join(__dirname, 'paircodes.json');
const sessionsFile = path.join(__dirname, 'sessions.json');

// Muda wa ku-expire kwa pair code (kwa millisekunde), hapa ni dakika 10
const PAIR_CODE_EXPIRY = 10 * 60 * 1000;

// Helper kusoma faili, kama haipo andika mpya
function readJsonFile(filepath) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// Helper kuandika faili
function writeJsonFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(express.static('public')); // Kama unatumia folder ya public kwa html,css

// API kuongeza pair code
app.post('/paircodes', (req, res) => {
  const { code, phone } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Code must be exactly 8 digits' });
  }
  if (!phone || !phone.match(/^\d+$/)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const pairCodes = readJsonFile(pairCodesFile);

  if (pairCodes[code]) {
    return res.status(400).json({ error: 'Pair code already exists' });
  }

  const now = Date.now();

  // Hifadhi pair code na phone na timestamp ya ku-create
  pairCodes[code] = {
    phone,
    createdAt: now
  };

  writeJsonFile(pairCodesFile, pairCodes);

  res.json({ message: 'Pair code created', code, phone });
});

// API kupata session id kwa pair code na phone
app.post('/get-session', (req, res) => {
  const { code, phone } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Code must be exactly 8 digits' });
  }
  if (!phone || !phone.match(/^\d+$/)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const pairCodes = readJsonFile(pairCodesFile);

  const entry = pairCodes[code];

  if (!entry) {
    return res.status(404).json({ error: 'Pair code not found' });
  }

  if (entry.phone !== phone) {
    return res.status(403).json({ error: 'Phone number does not match pair code' });
  }

  // Check expiry
  const now = Date.now();
  if (now - entry.createdAt > PAIR_CODE_EXPIRY) {
    // Delete expired pair code
    delete pairCodes[code];
    writeJsonFile(pairCodesFile, pairCodes);
    return res.status(410).json({ error: 'Pair code expired' });
  }

  // Load sessions
  const sessions = readJsonFile(sessionsFile);

  // If sessionId for this phone exists, return it, else create new
  if (!sessions[phone]) {
    // Simulate sessionId generate - replace this with real logic your bot uses
    sessions[phone] = `session-${phone}-${Math.random().toString(36).slice(2, 10)}`;

    writeJsonFile(sessionsFile, sessions);
  }

  res.json({ sessionId: sessions[phone] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
