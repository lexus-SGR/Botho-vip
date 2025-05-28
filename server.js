const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// File ya kuhifadhi paircodes
const pairCodesPath = path.join(__dirname, 'paircodes.json');

// Kusoma paircodes
function readPairCodes() {
  if (!fs.existsSync(pairCodesPath)) {
    fs.writeFileSync(pairCodesPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(pairCodesPath));
}

// Kuandika paircodes
function writePairCodes(data) {
  fs.writeFileSync(pairCodesPath, JSON.stringify(data, null, 2));
}

// Root route
app.get('/', (req, res) => {
  res.send('✅ Botho VIP Pair Code Server is Online!');
});

// Orodha ya paircodes
app.get('/paircodes', (req, res) => {
  const pairCodes = readPairCodes();
  res.json(pairCodes);
});

// Ongeza paircode mpya
app.post('/paircodes', (req, res) => {
  const { code, phone } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Code must be 8 digits' });
  }
  if (!phone || !phone.match(/^\d+$/)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const pairCodes = readPairCodes();
  if (pairCodes[code]) {
    return res.status(400).json({ error: 'Pair code already exists' });
  }

  pairCodes[code] = { phone, session: null }; // placeholder
  writePairCodes(pairCodes);

  res.json({ message: '✅ Pair code added successfully!' });
});

// Validate paircode and return session
app.post('/validate', (req, res) => {
  const { code, phone } = req.body;
  const pairCodes = readPairCodes();

  const entry = pairCodes[code];

  if (!entry) {
    return res.status(404).json({ error: '❌ Invalid code' });
  }

  if (entry.phone !== phone) {
    return res.status(401).json({ error: '❌ Phone number mismatch' });
  }

  // Simulate session ID creation (in real use, fetch actual session)
  const sessionId = `session-${Math.floor(100000 + Math.random() * 900000)}`;
  pairCodes[code].session = sessionId;
  writePairCodes(pairCodes);

  // TODO: Send session ID via WhatsApp bot
  console.log(`📤 Sending session ID "${sessionId}" to WhatsApp number: ${phone}`);

  res.json({ message: '✅ Validated successfully!', sessionId });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Pair Code Server running on port ${PORT}`);
});
