require('events').EventEmitter.defaultMaxListeners = 100;
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const P = require("pino");
const express = require("express");

const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

// SETTINGS
const OWNER_NUMBER = "255654478605";
const OWNER_JID = OWNER_NUMBER + "@s.whatsapp.net";
const PREFIX = "😁";

const AUTO_BIO = true;
const AUTO_VIEW_ONCE = process.env.AUTO_VIEW_ONCE === "on";
const ANTILINK_ENABLED = process.env.ANTILINK === "on";
const AUTO_TYPING = process.env.AUTO_TYPING === "on";
const RECORD_VOICE_FAKE = process.env.RECORD_VOICE_FAKE === "on";
const AUTO_REACT_EMOJI = process.env.AUTO_REACT_EMOJI || "";

const app = express();
const PORT = process.env.PORT || 3000;

let lastQRCode = null;

// JSON file paths
const antiLinkFile = path.join(__dirname, 'antilink.json');
const nsfwSettingsFile = path.join(__dirname, 'nsfwsettings.json');

// Load or initialize JSON data
let antiLinkGroups = {};
try {
  antiLinkGroups = JSON.parse(fs.readFileSync(antiLinkFile, 'utf-8'));
} catch {
  antiLinkGroups = {};
  fs.writeFileSync(antiLinkFile, JSON.stringify(antiLinkGroups, null, 2));
}

let nsfwSettings = {};
try {
  nsfwSettings = JSON.parse(fs.readFileSync(nsfwSettingsFile, 'utf-8'));
} catch {
  nsfwSettings = {};
  fs.writeFileSync(nsfwSettingsFile, JSON.stringify(nsfwSettings, null, 2));
}

// Welcome toggle groups
const welcomeGroups = new Set();

// COMMANDS Map
const commands = new Map();

// Command: NSFW Block on/off
commands.set("nsfwblock", {
  name: "nsfwblock",
  description: "Enable or disable NSFW blocker in group",
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command works only in groups." });
    if (!args.length) return await sock.sendMessage(from, { text: `Usage: ${PREFIX}nsfwblock on/off` });
    const arg = args[0].toLowerCase();
    if (arg !== "on" && arg !== "off") {
      return await sock.sendMessage(from, { text: `Please use 'on' or 'off'.` });
    }
    nsfwSettings[from] = arg === "on";
    fs.writeFileSync(nsfwSettingsFile, JSON.stringify(nsfwSettings, null, 2));
    await sock.sendMessage(from, { text: `NSFW blocker is now *${arg.toUpperCase()}* in this group.` });
  }
});

// Command: Menu
commands.set("menu", {
  name: "menu",
  description: "Show commands list",
  async execute(sock, msg, args, from, sender, isGroup) {
    const text = `
🤖 *lovenness-cyber WhatsApp Bot Menu* 🤖

${[...commands.keys()].map(cmd => `🔹 ${PREFIX}${cmd}`).join("\n")}

👑 Owner: @${OWNER_NUMBER}
    `;
    await sock.sendMessage(from, { text, mentions: [OWNER_JID] });
  }
});

// Handle view once message to auto download & resend
async function handleViewOnceMessage(msg, sock) {
  const viewOnceMsg = msg.message?.viewOnceMessageV2Extension?.message;
  if (viewOnceMsg) {
    const mediaType = Object.keys(viewOnceMsg)[0];
    await sock.sendMessage(msg.key.remoteJid, {
      [mediaType]: viewOnceMsg[mediaType],
      caption: viewOnceMsg[mediaType]?.caption || "",
    });
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })),
    },
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      lastQRCode = qr;
      qrcode.generate(qr, { small: true });
      console.log("Scan QR code above to login");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔁 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Delete auth folder and scan QR again.");
      }
    }

    if (connection === "open") {
      console.log("✅ Bot connected!");

      await sock.sendMessage(OWNER_JID, {
        text: `✅ lovenness-cyber Bot Connected!\nType ${PREFIX}menu for commands.`,
        mentions: [OWNER_JID],
      });

      if (AUTO_BIO) {
        const bio = `👑 cyber loven | 📅 ${new Date().toLocaleDateString("en-GB")}`;
        try {
          await sock.updateProfileStatus(bio);
        } catch (e) {
          console.error("❌ Bio update error:", e);
        }
      }
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    const groupId = update.id;
    if (!welcomeGroups.has(groupId)) return;

    for (const participant of update.participants) {
      if (update.action === "add") {
        const meta = await sock.groupMetadata(groupId);
        const text = `👋 Welcome @${participant.split("@")[0]} to *${meta.subject}*!`;
        await sock.sendMessage(groupId, { text, mentions: [participant] });
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];
    //  if (!msg.message || msg.key.fromMe) return;
      console.log("📩 Message received:", msg);
      const from = msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const sender = msg.key.participant || msg.key.remoteJid;
      const isOwner = sender === OWNER_NUMBER + "@s.whatsapp.net";
      
      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";
if (!msg.message || !isOwner) return;
      
      // Anti-link check
      if (
        ANTILINK_ENABLED &&
        isGroup &&
        antiLinkGroups[from]?.enabled &&
        body.includes("https://chat.whatsapp.com")
      ) {
        await sock.groupRemove(from, [sender]);
        await sock.sendMessage(from, { text: "❌ Joining group links are not allowed here." });
        return;
      }

      if (!body.startsWith(PREFIX)) return;

      const commandName = body.slice(PREFIX.length).split(/\s+/)[0].toLowerCase();
      const args = body.trim().split(/\s+/).slice(1);
      const command = commands.get(commandName);

      if (!command) return;

      if (AUTO_TYPING) await sock.sendPresenceUpdate("composing", from);
      if (RECORD_VOICE_FAKE) await sock.sendPresenceUpdate("recording", from);
      if (AUTO_REACT_EMOJI) {
        await sock.sendMessage(from, {
          react: { text: AUTO_REACT_EMOJI, key: msg.key },
        });
      }

      if (AUTO_VIEW_ONCE) await handleViewOnceMessage(msg, sock);

      await command.execute(sock, msg, args, from, sender, isGroup);

      // Welcome toggle command inside messages.upsert
      if (commandName === "welcome" && isGroup) {
        const meta = await sock.groupMetadata(from);
        const isAdmin = meta.participants.find(p => p.id === sender)?.admin != null;
        if (!isAdmin) return;
        if (welcomeGroups.has(from)) {
          welcomeGroups.delete(from);
          await sock.sendMessage(from, { text: "👋 Welcome message turned off." });
        } else {
          welcomeGroups.add(from);
          await sock.sendMessage(from, { text: "✅ Welcome message turned on." });
        }
      }

    } catch (err) {
      console.error("❌ Message handler error:", err);
    }
  });

  console.log("🤖 Bot is ready!");
}

// Express routes
app.get("/", (req, res) => {
  res.send("lovenness-cyber WhatsApp bot running!");
});

app.get("/qr", (req, res) => {
  if (!lastQRCode) return res.send("QR code not generated yet.");
  qrcode.toString(lastQRCode, { type: "terminal" }, (err, qrStr) => {
    if (err) return res.status(500).send("Failed to generate QR code.");
    res.type("text/plain").send(qrStr);
  });
});

// Start express server
app.listen(PORT, () => {
  console.log(`🌐 Express server running on http://localhost:${PORT}`);
});

// Start WhatsApp bot
startBot();
