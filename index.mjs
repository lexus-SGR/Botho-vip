import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 100;

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import qrcode from "qrcode-terminal";
import qrcodeImg from "qrcode";
import P from "pino";
import express from "express";

import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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

// JSON Paths
const antiLinkFile = path.join(__dirname, "antilink.json");
const nsfwSettingsFile = path.join(__dirname, "nsfwsettings.json");

// Load JSON files
let antiLinkGroups = fs.existsSync(antiLinkFile)
  ? JSON.parse(fs.readFileSync(antiLinkFile, "utf-8"))
  : {};
let nsfwSettings = fs.existsSync(nsfwSettingsFile)
  ? JSON.parse(fs.readFileSync(nsfwSettingsFile, "utf-8"))
  : {};

// Welcome toggle
const welcomeGroups = new Set();

// Commands
const commands = new Map();
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath);
  for (const file of files) {
    if (file.endsWith(".js")) {
      // Dynamically import ES module command
      const commandModule = await import(path.join(commandsPath, file));
      const command = commandModule.default || commandModule;
      if (command.name && typeof command.execute === "function") {
        commands.set(command.name.toLowerCase(), command);
        console.log(`✅ Loaded command: ${command.name}`);
      }
    }
  }
}

// Manual commands
commands.set("nsfwblock", {
  name: "nsfwblock",
  description: "Enable or disable NSFW blocker",
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup)
      return await sock.sendMessage(from, { text: "Group only command." });
    const arg = args[0]?.toLowerCase();
    if (arg !== "on" && arg !== "off")
      return await sock.sendMessage(from, { text: `Usage: ${PREFIX}nsfwblock on/off` });
    nsfwSettings[from] = arg === "on";
    fs.writeFileSync(nsfwSettingsFile, JSON.stringify(nsfwSettings, null, 2));
    await sock.sendMessage(from, { text: `NSFW blocker is now *${arg.toUpperCase()}*.` });
  },
});

commands.set("menu", {
  name: "menu",
  description: "List of commands",
  async execute(sock, msg, args, from, sender, isGroup) {
    const text = `
🤖 *lovenness-cyber Bot Menu* 🤖

${[...commands.keys()].map((cmd) => `🔹 ${PREFIX}${cmd}`).join("\n")}

👑 Owner: @${OWNER_NUMBER}
    `;
    await sock.sendMessage(from, { text, mentions: [OWNER_JID] });
  },
});

// View once
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

  sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      lastQRCode = qr;
      qrcode.generate(qr, { small: true });
      console.log("📷 Scan QR code above.");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Delete 'auth' folder and restart.");
      }
    }

    if (connection === "open") {
      console.log("✅ Bot connected.");
      await sock.sendMessage(OWNER_JID, {
        text: `🤖 *lovenness-cyber Bot Connected*\nType ${PREFIX}menu to begin.`,
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
      if (!msg.message || msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const sender = msg.key.participant || msg.key.remoteJid;
      const isOwner = sender === OWNER_JID;

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";

      if (!body.startsWith(PREFIX)) return;

      // Antilink
      if (
        ANTILINK_ENABLED &&
        isGroup &&
        antiLinkGroups[from]?.enabled &&
        body.includes("https://chat.whatsapp.com")
      ) {
        await sock.groupRemove(from, [sender]);
        await sock.sendMessage(from, { text: "🚫 Group links are not allowed!" });
        return;
      }

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

      if (commandName === "welcome" && isGroup) {
        const meta = await sock.groupMetadata(from);
        const isAdmin = meta.participants.find((p) => p.id === sender)?.admin != null;
        if (!isAdmin) return;
        if (welcomeGroups.has(from)) {
          welcomeGroups.delete(from);
          await sock.sendMessage(from, { text: "👋 Welcome message turned OFF." });
        } else {
          welcomeGroups.add(from);
          await sock.sendMessage(from, { text: "✅ Welcome message turned ON." });
        }
      }
    } catch (err) {
      console.error("❌ Message error:", err);
    }
  });

  console.log("🤖 Bot initialized.");
}

// EXPRESS ROUTES
app.get("/", (req, res) => {
  res.send("💡 lovenness-cyber WhatsApp bot is online!");
});

app.get("/qr", (req, res) => {
  if (!lastQRCode) return res.send("📷 QR code not ready.");
  qrcodeImg.toDataURL(lastQRCode, (err, url) => {
    if (err) return res.send("⚠️ QR error.");
    res.send(`<img src="${url}" alt="QR Code">`);
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running on http://localhost:${PORT}`);
});

// START BOT
startBot();
