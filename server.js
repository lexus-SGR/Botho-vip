const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // serve frontend

const pairCodesPath = path.join(__dirname, 'paircodes.json');

function readPairCodes() {
  if (!fs.existsSync(pairCodesPath)) {
    fs.writeFileSync(pairCodesPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(pairCodesPath));
}

function writePairCodes(data) {
  fs.writeFileSync(pairCodesPath, JSON.stringify(data, null, 2));
}

app.get('/paircodes', (req, res) => {
  const pairCodes = readPairCodes();
  res.json(pairCodes);
});

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

  pairCodes[code] = phone;
  writePairCodes(pairCodes);

  res.json({ message: 'Pair code added successfully', pairCodes });
});

app.post('/validate', (req, res) => {
  const { code, phone } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Code must be 8 digits' });
  }
  if (!phone || !phone.match(/^\d{10,15}$/)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const pairCodes = readPairCodes();

  if (!pairCodes[code]) {
    return res.status(404).json({ error: 'Pair code not found' });
  }

  if (pairCodes[code] !== phone) {
    return res.status(403).json({ error: 'Phone number does not match the pair code' });
  }

  const sessionId = `SESSION-${Math.random().toString(36).substr(2, 10).toUpperCase()}`;

  console.log(`✅ Session ID for ${phone}: ${sessionId}`);

  return res.json({ sessionId });
});

app.listen(PORT, () => {
  console.log(`✅ Pair Code Server running on port ${PORT}`);
});
