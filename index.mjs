import { EventEmitter } from "events"; 
EventEmitter.defaultMaxListeners = 100;
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import dotenv from "dotenv"; dotenv.config();
import figlet from "figlet";
import fs from "fs"; 
import path from "path"; 
import { exec } from "child_process";
import qrcode from "qrcode-terminal"; 
import qrcodeImg from "qrcode"; 
import P from "pino"; 
import express from "express";
import { writeFile } from "fs/promises";
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  makeCacheableSignalKeyStore, 
  downloadMediaMessage 
} from "@whiskeysockets/baileys";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const OWNER_NUMBER = "255654478605"; 
const OWNER_JID = OWNER_NUMBER + "@s.whatsapp.net"; 
const PREFIX = "😁";

const AUTO_BIO = true; 
const AUTO_VIEW_ONCE = process.env.AUTO_VIEW_ONCE === "on"; 
const AUTO_VIEW_STATUS = process.env.AUTO_VIEW_STATUS === "on"; 
const ANTILINK_ENABLED = process.env.ANTILINK === "on"; 
const tenorApiKey = process.env.TENOR_API_KEY;


const AUTO_TYPING = process.env.AUTO_TYPING === "on"; 
const RECORD_VOICE_FAKE = process.env.RECORD_VOICE_FAKE === "on"; 
const AUTO_REACT_EMOJI = process.env.AUTO_REACT_EMOJI || "";

const app = express(); 
const PORT = process.env.PORT || 3000; 
let lastQRCode = null;

const antiLinkFile = path.join(__dirname, "antilink.json"); 
const nsfwSettingsFile = path.join(__dirname, "nsfwsettings.json"); 
let antiLinkGroups = fs.existsSync(antiLinkFile) ? JSON.parse(fs.readFileSync(antiLinkFile)) : {}; 
let nsfwSettings = fs.existsSync(nsfwSettingsFile) ? JSON.parse(fs.readFileSync(nsfwSettingsFile)) : {}; 

const welcomeGroups = new Set(); 
const commands = new Map();

// Load commands dynamically from "commands" folder
async function loadCommands() {
  const commandsPath = path.join(__dirname, "commands");
  if (!fs.existsSync(commandsPath)) {
    console.warn("⚠️ 'commands' folder haipo, haikupatikana.");
    return;
  }
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js") || f.endsWith(".mjs"));
  for (const file of files) {
    try {
      const commandPath = path.join(commandsPath, file);
      const { default: command } = await import(`file://${commandPath}`);
      if (command && command.name && typeof command.execute === "function") {
        commands.set(command.name.toLowerCase(), command);
        console.log(`✅ Loaded command: ${command.name} (${file})`);
      } else {
        console.warn(`⚠️ Command ${file} haikufaulu validate, hakijajumuishwa.`);
      }
    } catch (e) {
      console.error(`❌ Error loading command ${file}:`, e);
    }
  }
}

// ➕ SPAMLINK Command (inline, example)
commands.set("spamlink", {
  name: "spamlink",
  description: "Tuma link mara 200 kwa adhabu ya kutuma link group",
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "Hii command ni kwa group tu." });
    if (!args[0]) return await sock.sendMessage(from, { text: `Usage: ${PREFIX}spamlink <link>` });
    const link = args[0];
    if (!link.includes("http")) return await sock.sendMessage(from, { text: "Tafadhali weka link sahihi." });

    for (let i = 0; i < 200; i++) {
      await sock.sendMessage(from, { text: link });
    }

    await sock.sendMessage(from, { text: "❌ Siku nyingine usirudie kutuma link kwenye group langu sawa bwa mdogo." });
  }
});

// menu command (inline)
commands.set("menu", { 
  name: "menu", 
  description: "List of commands", 
  async execute(sock, msg, args, from, sender, isGroup) { 
    const commandList = [...commands.keys()]
      .map((cmd) => `🔹 ${PREFIX}${cmd}`)
      .join("\n");
    const text = `\n🤖 *lovenness-cyber Bot Menu* 🤖\n${commandList}\n\n👑 Owner: @${OWNER_NUMBER}`; 
    await sock.sendMessage(from, { text, mentions: [OWNER_JID] }); 
  }, 
});

commands.set("nsfwblock", { 
  name: "nsfwblock", 
  async execute(sock, msg, args, from, sender, isGroup) { 
    if (!isGroup) return await sock.sendMessage(from, { text: "Group only command." }); 
    const arg = args[0]?.toLowerCase(); 
    if (arg !== "on" && arg !== "off") return await sock.sendMessage(from, { text: `Usage: ${PREFIX}nsfwblock on/off` }); 
    nsfwSettings[from] = arg === "on"; 
    fs.writeFileSync(nsfwSettingsFile, JSON.stringify(nsfwSettings, null, 2)); 
    await sock.sendMessage(from, { text: `NSFW blocker is now *${arg.toUpperCase()}*.` }); 
  }, 
});

async function startBot() { 
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState("./auth"); 
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({ 
    version, 
    auth: { 
      creds: state.creds, 
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })), 
    }, 
    logger: P({ level: "silent" }), 
    printQRInTerminal: false, 
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => { 
    if (qr) { 
      lastQRCode = qr; 
      qrcode.generate(qr, { small: true }); 
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
        text: `🤖 *Bot Connected*\nType ${PREFIX}menu to begin.`,
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
    if (!welcomeGroups.has(update.id)) return; 
    for (const participant of update.participants) { 
      if (update.action === "add") { 
        const meta = await sock.groupMetadata(update.id); 
        const text = `👋 Welcome @${participant.split("@")[0]} to *${meta.subject}*!`; 
        await sock.sendMessage(update.id, { text, mentions: [participant] }); 
      } 
    } 
  });

  sock.ev.on("messages.delete", async (del) => { 
    if (!del || !del.keys) return; 
    for (const key of del.keys) { 
      if (key.fromMe) continue; 
      try { 
        const message = await sock.loadMessage(key.remoteJid, key.id); 
        if (message) { 
          const content = message.message; 
          const type = Object.keys(content || {})[0]; 
          const senderNum = key.participant.split("@")[0]; 
          let textMsg = content?.[type]?.text || content?.conversation || "[media or unsupported content]"; 
          await sock.sendMessage(key.remoteJid, { 
            text: `♻️ *Anti-Delete*\nMessage from @${senderNum}:\n\n${textMsg}`, 
            mentions: [key.participant], 
          }); 
        } 
      } catch (e) { 
        console.error("⚠️ Anti-delete error:", e.message); 
      } 
    } 
  });

  // Helper: Handle view once message open
  async function handleViewOnceMessage(msg) {
    const viewOnceMsg = msg.message?.viewOnceMessageV2Extension?.message;
    if (viewOnceMsg) {
      const mediaType = Object.keys(viewOnceMsg)[0];
      await sock.sendMessage(msg.key.remoteJid, {
        [mediaType]: viewOnceMsg[mediaType],
        caption: viewOnceMsg[mediaType]?.caption || "",
      });
    }
  }

  const viewedStatusJids = new Set();

  sock.ev.on("messages.upsert", async ({ messages }) => { 
    try { 
      const msg = messages[0]; 
      //if (!msg.message || msg.key.fromMe) return; 
      const from = msg.key.remoteJid; 
      const isGroup = from.endsWith("@g.us"); 
      const sender = msg.key.participant || msg.key.remoteJid; 
      const isOwner = sender === OWNER_JID;

      // Auto view once
      if (AUTO_VIEW_ONCE && msg.message.viewOnceMessageV2Extension) {
        await handleViewOnceMessage(msg);
        return;
      }

      // Auto view status
      if (AUTO_VIEW_STATUS && from === "status@broadcast") {
        if (!viewedStatusJids.has(sender)) {
          viewedStatusJids.add(sender);
          await sock.readMessages([msg.key]);
          await sock.sendMessage(sender, { text: `👁️ Status yako imeonwa na *Ben Whittaker 🤪*` });
          console.log(`👀 Auto viewed status from ${sender}`);
        }
        return;
      }

      const body = 
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption || "";

      if (!body.startsWith(PREFIX)) return;

      // Anti-link kick logic
      if (
        ANTILINK_ENABLED &&
        isGroup &&
        antiLinkGroups[from]?.enabled &&
        body.includes("https://chat.whatsapp.com")
      ) {
        if (!isOwner) {
          try {
            await sock.sendMessage(from, { text: `❌ Linki za WhatsApp haziruhusiwi hapa, @${sender.split("@")[0]} umeondolewa kwa kutuma link!` }, { mentions: [sender] });
            await sock.groupRemove(from, [sender]);
          } catch (e) {
            console.error("❌ Error removing user for anti-link:", e);
          }
          return;
        }
      }

      // Parse command and args
      const args = body.trim().slice(PREFIX.length).split(/\s+/);
      const commandName = args.shift().toLowerCase();

      if (commands.has(commandName)) {
        try {
          await commands.get(commandName).execute(sock, msg, args, from, sender, isGroup);
        } catch (e) {
          console.error(`❌ Error executing command ${commandName}:`, e);
          await sock.sendMessage(from, { text: `⚠️ Error running command *${commandName}*.` });
        }
      }
    } catch (err) {
      console.error("❌ messages.upsert event error:", err);
    }
  });

  app.get("/", (req, res) => {
    res.send(`<h1>🤖 Ben Whittaker Bot is running</h1><p>Send me a message on WhatsApp: ${OWNER_NUMBER}</p>`);
  });

  app.get("/qr", async (req, res) => {
    if (!lastQRCode) {
      return res.send("QR code not generated yet, please wait...");
    }
    try {
      const qrDataUrl = await qrcodeImg.toDataURL(lastQRCode);
      res.setHeader("Content-Type", "text/html");
      res.send(`<img src="${qrDataUrl}" alt="QR Code" />`);
    } catch (e) {
      res.status(500).send("Error generating QR code image.");
    }
  });

  app.listen(PORT, () => {
    console.log(`🌐 Server running at http://localhost:${PORT}`);
  });

  figlet.text("Ben Whittaker Tech Bot", (err, data) => {
    if (err) return console.log("Figlet error:", err);
    console.log(data);
  });
}

startBot();
