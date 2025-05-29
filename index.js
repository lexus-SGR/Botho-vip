const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, getContentType, proto } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const PREFIX = "😁";
const ownerNumber = process.env.BOT_OWNER + "@s.whatsapp.net";
const botBio = "loveness-cyber (B-GIRL)";

const commandsDir = path.join(process.cwd(), "commands");
const commands = new Map();

fs.readdirSync(commandsDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const cmd = require(path.join(commandsDir, file));
    if (cmd.name && cmd.execute) {
      commands.set(cmd.name, cmd);
      console.log(`✅ Loaded command: ${cmd.name}`);
    }
  }
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  // 🟢 Auto Bio & Fake Recording
  setInterval(async () => {
    try {
      await sock.updateProfileStatus(botBio);
      await sock.sendPresenceUpdate("recording", ownerNumber);
    } catch (e) {
      console.error("Auto bio error:", e);
    }
  }, 10 * 1000);

  // 🟢 Auto View Status
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (let msg of messages) {
      if (!msg.key.fromMe && msg.key.remoteJid === "status@broadcast") {
        try {
          await sock.readMessages([msg.key]);
        } catch (e) {
          console.log("Auto view status error:", e);
        }
      }
    }
  });

  // 🟢 Auto Open ViewOnce
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

  // 🛑 Anti-Link with Warnings
  const warningsFile = "./warnings.json";
  let warnings = fs.existsSync(warningsFile) ? JSON.parse(fs.readFileSync(warningsFile)) : {};

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    const isGroup = from.endsWith("@g.us");

    // 🔗 Anti-link
    if (isGroup && process.env.ANTI_LINK === "on") {
      const text = m.message.conversation || m.message.extendedTextMessage?.text || "";
      const linkRegex = /(https?:\/\/[^\s]+)/gi;

      if (linkRegex.test(text.toLowerCase())) {
        const metadata = await sock.groupMetadata(from);
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = metadata.participants.find((p) => p.id === botNumber);

        if (botParticipant?.admin) {
          warnings[sender] = (warnings[sender] || 0) + 1;
          fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));

          if (warnings[sender] >= 3) {
            await sock.groupParticipantsUpdate(from, [sender], "remove");
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]} removed for sending links 3 times.`,
              contextInfo: { mentionedJid: [sender] },
            });
            delete warnings[sender];
            fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
          } else {
            await sock.sendMessage(from, {
              text: `⚠️ @${sender.split("@")[0]}\n\n🚫 Warning ${warnings[sender]}/3 for sending a link.`,
              contextInfo: { mentionedJid: [sender] },
            });
          }
        }
        return;
      }
    }

    // ⚙️ Command Handling
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
      console.error("❌ Command error:", e);
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode || 0;
      if (statusCode !== 401) {
        console.log("🔁 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Session expired. Scan again.");
      }
    }
    if (connection === "open") {
      console.log("✅ Bot connected.");
    }
  });
}

startBot();
