require('events').EventEmitter.defaultMaxListeners = 100;
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const qrcode = require("qrcode-terminal");
const P = require("pino");

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

// ========= ENV CONFIG ===========
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

// ========= DATA STORAGE ===========
let antiLinkGroups = {};
try {
  antiLinkGroups = JSON.parse(fs.readFileSync('./antilink.json'));
} catch {
  fs.writeFileSync('./antilink.json', '{}');
}

const welcomeGroups = new Set();

// ========= BOT START ===========
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

      const welcomeText = `
🔰 *WELCOME TO love cyber WHATSAPP BOT* 🔰
✅ *Bot Connected Successfully!*
👑 *Owner:* @${OWNER_NUMBER}
ℹ️ Type *${PREFIX}menu* or *${PREFIX}help* for commands.
      `;
      await sock.sendMessage(OWNER_JID, { text: welcomeText, mentions: [OWNER_JID] });

      if (AUTO_BIO) {
        const dateStr = new Date().toLocaleDateString('en-GB');
        const quotes = [
          "Learning never exhausts the mind.",
          "Laughter is timeless, imagination has no age.",
          "The best way to predict the future is to create it.",
          "Education is the most powerful weapon.",
          "Entertainment is the spark of learning!"
        ];

        const newBio = `👑 cyber loven | 👤 herieth | 📅 ${dateStr} | ✨ ${quotes[Math.floor(Math.random() * quotes.length)]}`;
        try {
          await sock.updateProfileStatus(newBio);
        } catch (e) {
          console.error("❌ Failed to update bio:", e.message);
        }
      }
    }
  });

  // WELCOME GROUPS
  sock.ev.on('group-participants.update', async (update) => {
    const groupId = update.id;
    if (welcomeGroups.has(groupId)) {
      for (const participant of update.participants) {
        if (update.action === 'add') {
          try {
            const groupMetadata = await sock.groupMetadata(groupId);
            const groupName = groupMetadata.subject;
            const welcomeText = `👋 Hello @${participant.split('@')[0]}!\n\nWelcome to *${groupName}*.\nWe're glad to have you here!`;
            await sock.sendMessage(groupId, {
              text: welcomeText,
              mentions: [participant]
            });
          } catch (e) {
            console.error("❌ Error sending welcome message:", e.message);
          }
        }
      }
    }
  });

  // LOAD COMMANDS
  const commands = new Map();
  const commandsPath = path.join(__dirname, "commands");
  if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

  fs.readdirSync(commandsPath).filter(f => f.endsWith(".js")).forEach(file => {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.name) commands.set(cmd.name.toLowerCase(), cmd);
  });

  // ON MESSAGE
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

    if (command) {
      try {
        await command.execute(sock, msg, args, from, sender, isGroup);
      } catch (err) {
        console.error("Command error:", err);
      }
    }

    let groupMetadata = {}, isAdmin = false, botIsAdmin = false;
    if (isGroup) {
      groupMetadata = await sock.groupMetadata(from);
      isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin != null;
      const botJid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
      botIsAdmin = groupMetadata.participants.find(p => p.id === botJid)?.admin != null;
    }

    if (AUTO_TYPING) await sock.sendPresenceUpdate('composing', from);
    if (RECORD_VOICE_FAKE) await sock.sendPresenceUpdate('recording', from);
    if (AUTO_REACT_EMOJI) {
      await sock.sendMessage(from, {
        react: { text: AUTO_REACT_EMOJI, key: msg.key }
      });
    }

    if (AUTO_VIEW_ONCE) {
      await handleViewOnceMessage(msg, sock);
    }

    if (ANTILINK_ENABLED && isGroup && antiLinkGroups[from]?.enabled) {
      if (body.includes("https://chat.whatsapp.com")) {
        if (!isAdmin && botIsAdmin) {
          try {
            await sock.sendMessage(from, { delete: msg.key });
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]}, you shared a forbidden link.\nYou will be removed from the group shortly.`,
              mentions: [sender]
            });
            await new Promise(resolve => setTimeout(resolve, 5000));
            await sock.groupParticipantsUpdate(from, [sender], "remove");
            await sock.sendMessage(from, {
              text: `✅ @${sender.split("@")[0]} has been removed for sharing a forbidden link.`,
              mentions: [sender]
            });
          } catch (e) {
            console.error("❌ Error handling antilink:", e);
          }
        }
      }
    }

    // ANTI-LINK COMMAND
    if (body.startsWith(`${PREFIX}antilink`) && isAdmin) {
      const option = args[0]?.toLowerCase();
      if (option === "on") {
        antiLinkGroups[from] = { enabled: true };
        fs.writeFileSync('./antilink.json', JSON.stringify(antiLinkGroups, null, 2));
        await sock.sendMessage(from, { text: "✅ Antilink enabled." });
      } else if (option === "off") {
        delete antiLinkGroups[from];
        fs.writeFileSync('./antilink.json', JSON.stringify(antiLinkGroups, null, 2));
        await sock.sendMessage(from, { text: "❎ Antilink disabled." });
      } else {
        const status = antiLinkGroups[from]?.enabled ? "✅ ON" : "❎ OFF";
        await sock.sendMessage(from, { text: `Antilink is: *${status}*` });
      }
      return;
    }

    // WELCOME TOGGLE
    if (body === `${PREFIX}welcome`) {
      if (!isGroup) {
        await sock.sendMessage(from, { text: "❌ This command is for groups only." }, { quoted: msg });
        return;
      }
      if (!isAdmin) {
        await sock.sendMessage(from, { text: "❌ Only admins can use this command." }, { quoted: msg });
        return;
      }

      if (welcomeGroups.has(from)) {
        welcomeGroups.delete(from);
        await sock.sendMessage(from, { text: "👋 Welcome messages have been *disabled*." }, { quoted: msg });
      } else {
        welcomeGroups.add(from);
        await sock.sendMessage(from, { text: "✅ Welcome messages have been *enabled*." }, { quoted: msg });
      }
      return;
    }
  });
}

// VIEW ONCE HANDLER
async function handleViewOnceMessage(msg, sock) {
  const viewOnce = msg.message?.viewOnceMessage;
  if (!viewOnce) return;

  try {
    const viewOnceContent = viewOnce.message;
    if (!viewOnceContent) return;
    const from = msg.key.remoteJid;
    await sock.sendMessage(from, {
      ...viewOnceContent,
      viewOnce: true
    });
  } catch (error) {
    console.error("❌ Error handling view once message:", error);
  }
}

// Start the bot
startBot().catch(err => console.error("Bot start error:", err));
