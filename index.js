// ANZIA FILE HAPA
require('events').EventEmitter.defaultMaxListeners = 100;
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const P = require("pino");
const path = require("path");

const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

const app = express();
app.get("/", (req, res) => res.send("Fatuma WhatsApp Bot is running!"));
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port " + (process.env.PORT || 3000))
);

// ==== SETTINGS ====
const OWNER_NUMBER = "255654478605";
const OWNER_JID = OWNER_NUMBER + "@s.whatsapp.net";
const PREFIX = "😁";

const AUTO_BIO = true;
const AUTO_VIEW_ONCE = process.env.AUTO_VIEW_ONCE === "on";
const ANTILINK_ENABLED = process.env.ANTILINK === "on";
const AUTO_TYPING = process.env.AUTO_TYPING === "on";
const RECORD_VOICE_FAKE = process.env.RECORD_VOICE_FAKE === "on";
const AUTO_VIEW_STATUS = process.env.AUTO_VIEW_STATUS === "on";
const AUTO_REACT_EMOJI = process.env.AUTO_REACT_EMOJI || "";

let antiLinkGroups = {};
try {
  antiLinkGroups = JSON.parse(fs.readFileSync('./antilink.json'));
} catch {
  fs.writeFileSync('./antilink.json', '{}');
}

const welcomeGroups = new Set();
const commands = new Map();

// ==== MFANO WA COMMAND NDANI YA FILE HII ====
commands.set("menu", {
  name: "menu",
  description: "Show all commands",
  async execute(sock, msg, args, from, sender, isGroup) {
    const text = `
✨ *Fatuma WhatsApp Bot Menu* ✨

${[...commands.keys()].map(cmd => `🔹 ${PREFIX}${cmd}`).join("\n")}

👑 Owner: @${OWNER_NUMBER}
    `;
    await sock.sendMessage(from, { text, mentions: [OWNER_JID] });
  }
});

// ==== START BOT ====
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
    },
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => {
    if (qr) qrcode.generate(qr, { small: true });

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected!");

      await sock.sendMessage(OWNER_JID, {
        text: `✅ Fatuma Bot Connected!\nType ${PREFIX}menu for commands.`,
        mentions: [OWNER_JID]
      });

      if (AUTO_BIO) {
        const dateStr = new Date().toLocaleDateString('en-GB');
        const bio = `👑 cyber loven | 👤 herieth | 📅 ${dateStr}`;
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
    if (welcomeGroups.has(groupId)) {
      for (const participant of update.participants) {
        if (update.action === 'add') {
          try {
            const meta = await sock.groupMetadata(groupId);
            const text = `👋 Karibu @${participant.split("@")[0]} kwenye *${meta.subject}*!`;
            await sock.sendMessage(groupId, { text, mentions: [participant] });
          } catch (e) {
            console.error("❌ Welcome error:", e);
          }
        }
      }
    }
  });

  // === MESSAGES ===
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = msg.key.participant || msg.key.remoteJid;

    const body = msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption || "";

    const commandName = body.startsWith(PREFIX)
      ? body.slice(PREFIX.length).split(/\s+/)[0].toLowerCase()
      : null;

    const args = body.trim().split(/\s+/).slice(1);
    const command = commands.get(commandName);

    if (AUTO_TYPING) await sock.sendPresenceUpdate('composing', from);
    if (RECORD_VOICE_FAKE) await sock.sendPresenceUpdate('recording', from);
    if (AUTO_REACT_EMOJI) {
      await sock.sendMessage(from, { react: { text: AUTO_REACT_EMOJI, key: msg.key } });
    }

    if (AUTO_VIEW_ONCE) await handleViewOnceMessage(msg, sock);

    if (command) {
      try {
        await command.execute(sock, msg, args, from, sender, isGroup);
      } catch (err) {
        console.error("Command error:", err);
      }
    }

    if (ANTILINK_ENABLED && isGroup && antiLinkGroups[from]?.enabled) {
      if (body.includes("https://chat.whatsapp.com")) {
        const groupMetadata = await sock.groupMetadata(from);
        const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin != null;
        const botJid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botIsAdmin = groupMetadata.participants.find(p => p.id === botJid)?.admin != null;

        if (!isAdmin && botIsAdmin) {
          try {
            await sock.sendMessage(from, { delete: msg.key });
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]}, you shared a group link. You will be removed.`,
              mentions: [sender]
            });
            await sock.groupParticipantsUpdate(from, [sender], "remove");
          } catch (e) {
            console.error("❌ Antilink error:", e);
          }
        }
      }
    }

    // Toggle welcome
    if (body === `${PREFIX}welcome`) {
      if (!isGroup) return;
      const groupMetadata = await sock.groupMetadata(from);
      const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin != null;
      if (!isAdmin) return;

      if (welcomeGroups.has(from)) {
        welcomeGroups.delete(from);
        await sock.sendMessage(from, { text: "👋 Welcome message disabled." });
      } else {
        welcomeGroups.add(from);
        await sock.sendMessage(from, { text: "✅ Welcome message enabled." });
      }
    }

    // Toggle antilink
    if (body.startsWith(`${PREFIX}antilink`)) {
      const groupMetadata = await sock.groupMetadata(from);
      const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin != null;
      if (!isAdmin) return;

      const option = args[0]?.toLowerCase();
      if (option === "on") {
        antiLinkGroups[from] = { enabled: true };
        fs.writeFileSync('./antilink.json', JSON.stringify(antiLinkGroups, null, 2));
        await sock.sendMessage(from, { text: "✅ Antilink enabled." });
      } else if (option === "off") {
        delete antiLinkGroups[from];
        fs.writeFileSync('./antilink.json', JSON.stringify(antiLinkGroups, null, 2));
        await sock.sendMessage(from, { text: "❎ Antilink disabled." });
      }
    }
  });
}

// === HANDLE VIEW ONCE ===
async function handleViewOnceMessage(msg, sock) {
  const viewOnce = msg.message?.viewOnceMessage;
  if (!viewOnce) return;

  try {
    const viewOnceContent = viewOnce.message;
    const from = msg.key.remoteJid;
    await sock.sendMessage(from, { ...viewOnceContent, viewOnce: false });
  } catch (e) {
    console.error("❌ View once error:", e);
  }
}

// === START ===
startBot().catch(err => console.error("Start error:", err));
