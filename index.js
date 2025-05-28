 require("dotenv").config(); const fs = require("fs"); const pino = require("pino"); const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys"); const { Boom } = require("@hapi/boom"); const archiver = require("archiver"); const path = require("path");

const logger = pino({ level: "silent" }); const OWNER = process.env.OWNER_NUMBER || "255000000000"; // Example owner number const PREFIX = process.env.PREFIX || "!"; const SESSION_ROOT = path.join(__dirname, "sessions");

const pairedUsers = {}; // Store pair codes and numbers

async function startBot() { const { version } = await fetchLatestBaileysVersion(); const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys"); const sock = makeWASocket({ version, logger, printQRInTerminal: true, auth: state, browser: ["Bot", "Chrome", "10.0"], });

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => { const { connection, lastDisconnect } = update; if (connection === "close") { const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startBot(); } else if (connection === "open") { console.log("✅ Bot connected."); } });

sock.ev.on("messages.upsert", async ({ messages }) => { const msg = messages[0]; if (!msg.message || msg.key.fromMe || msg.key.remoteJid === "status@broadcast") return;

const from = msg.key.remoteJid;
const sender = msg.key.participant || msg.key.remoteJid;
const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

if (!body.startsWith(PREFIX)) return;

const args = body.slice(PREFIX.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

// Only allow owner or paired users
if (sender !== OWNER && !pairedUsers[sender]) {
  await sock.sendMessage(from, { text: "❌ You are not authorized to use this bot." }, { quoted: msg });
  return;
}

// Commands
if (command === "menu") {
  await sock.sendMessage(from, {
    image: fs.readFileSync("./ommy.png"),
    caption: `🤖 *Ben Whittaker Bot*\n

👤 Owner: ${OWNER} 🔤 Prefix: ${PREFIX} 🧩 Plugins: ${fs.readdirSync("./commands").length} ⚙️ Mode: Public 🧪 Version: 1.0.0 ⚡ Speed: ${Date.now() - msg.messageTimestamp * 1000}ms 💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` }, { quoted: msg });

} else if (command === "pair") {
  const pairCode = Math.random().toString(36).slice(2, 8);
  pairedUsers[pairCode] = args[0] + "@s.whatsapp.net";
  await sock.sendMessage(from, { text: `🔐 Pair code for ${args[0]} is: *${pairCode}*` }, { quoted: msg });

} else if (command === "usepair") {
  const code = args[0];
  const number = args[1] + "@s.whatsapp.net";
  if (pairedUsers[code] === number) {
    pairedUsers[number] = true;
    await sock.sendMessage(from, { text: `✅ Pair success for ${args[1]}` }, { quoted: msg });
  } else {
    await sock.sendMessage(from, { text: `❌ Invalid pair code.` }, { quoted: msg });
  }

} else if (command === "getsession") {
  const userNum = sender.replace("@s.whatsapp.net", "");
  const sessionFolder = path.join(SESSION_ROOT, userNum);
  const zipName = `session-${userNum}.zip`;
  const output = fs.createWriteStream(zipName);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", async () => {
    await sock.sendMessage(from, {
      document: fs.readFileSync(zipName),
      fileName: zipName,
      mimetype: "application/zip"
    }, { quoted: msg });
    fs.unlinkSync(zipName);
  });

  archive.pipe(output);
  archive.directory(sessionFolder, false);
  await archive.finalize();
}

});

commands const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js")); for (const file of commandFiles) { require(./commands/${file})(sock); } }

startBot();

