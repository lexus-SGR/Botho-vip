// index.js (CommonJS WhatsApp bot with session, anti-link, warning system)

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const PREFIX = process.env.PREFIX || "😁";
const ownerNumber = process.env.BOT_OWNER + "@s.whatsapp.net";

const commandsDir = path.join(process.cwd(), "commands");
const commands = new Map();

// Load commands from commands folder
fs.readdirSync(commandsDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const cmd = require(path.join(commandsDir, file));
    if (cmd.name && cmd.execute) {
      commands.set(cmd.name, cmd);
      console.log(`Loaded command: ${cmd.name}`);
    }
  }
});

async function startBot() {
  // Load auth session state
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  // Get latest WA protocol version
  const { version } = await fetchLatestBaileysVersion();

  // Create socket connection
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    version,
  });

  // Save credentials on update
  sock.ev.on("creds.update", saveCreds);

  // Auto open view once message if enabled
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const m of messages) {
      if (!m.message) continue;

      if (process.env.AUTO_OPEN_VIEWONCE === "on" && m.message.viewOnceMessage) {
        try {
          await sock.sendMessage(m.key.remoteJid, {
            viewOnceMessage: {
              message: m.message.viewOnceMessage.message,
              expireDuration: 0,
              viewOnce: false,
            },
          });
        } catch (e) {
          console.log("Auto-open viewOnce error:", e);
        }
      }
    }
  });

  // Load or initialize warnings
  const warningsFile = "./warnings.json";
  let warnings = {};
  if (fs.existsSync(warningsFile)) {
    warnings = JSON.parse(fs.readFileSync(warningsFile));
  }

  // Listen for messages to implement anti-link and commands
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    // Anti-link feature for groups
    if (from.endsWith("@g.us") && process.env.ANTI_LINK === "on") {
      const text = m.message.conversation || m.message.extendedTextMessage?.text || "";
      const linkRegex = /(https?:\/\/[^\s]+)/gi;

      if (linkRegex.test(text.toLowerCase())) {
        const metadata = await sock.groupMetadata(from);
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = metadata.participants.find((p) => p.id === botNumber);

        if (botParticipant?.admin) {
          const userWarnings = warnings[sender] || 0;
          warnings[sender] = userWarnings + 1;
          fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));

          if (warnings[sender] >= 3) {
            await sock.groupParticipantsUpdate(from, [sender], "remove");
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]} has been removed for exceeding the link warning limit (3/3).`,
              contextInfo: { mentionedJid: [sender] },
            });
            delete warnings[sender];
            fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
          } else {
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]}

╭────⬡ WARNING ⬡────
├▢ USER : @${sender.split("@")[0]}
├▢ COUNT : ${warnings[sender]}
├▢ REASON : LINK SENDING
├▢ WARN LIMIT : 3
╰────────────────`,
              contextInfo: { mentionedJid: [sender] },
            });
          }
        }
        return;
      }
    }

    // Process commands
    let body = "";
    if (m.message.conversation) body = m.message.conversation;
    else if (m.message.extendedTextMessage) body = m.message.extendedTextMessage.text;
    else return;

    if (!body.startsWith(PREFIX)) return;

    const args = body.slice(PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if (!commands.has(cmdName)) return;

    try {
      await commands.get(cmdName).execute(sock, m, args, from, sender);
    } catch (e) {
      console.error("Command execution error:", e);
    }
  });

  // Connection update handling
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode || 0;
      if (statusCode !== 401) {
        console.log("Reconnecting...");
        startBot();
      } else {
        console.log("Session expired. Re-auth required.");
      }
    }
    if (connection === "open") {
      console.log("✅ Bot connected successfully.");
    }
  });
}

startBot();
