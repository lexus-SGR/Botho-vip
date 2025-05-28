const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Path ya paircodes file
const pairCodesPath = path.join(__dirname, 'paircodes.json');

// Helper kusoma paircodes
function readPairCodes() {
  if (!fs.existsSync(pairCodesPath)) {
    fs.writeFileSync(pairCodesPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(pairCodesPath));
}

// Helper kuandika paircodes
function writePairCodes(data) {
  fs.writeFileSync(pairCodesPath, JSON.stringify(data, null, 2));
}

// API kuangalia pair codes zote
app.get('/paircodes', (req, res) => {
  const pairCodes = readPairCodes();
  res.json(pairCodes);
});

// API kuongeza pair code mpya
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

// Server start
app.listen(PORT, () => {
  console.log(`Pair Code Server running on port ${PORT}`);
});
