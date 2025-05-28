import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PREFIX = process.env.PREFIX || "😁";
const ownerNumber = process.env.BOT_OWNER + "@s.whatsapp.net";

// Load commands from /commands folder
const commandsDir = path.join(process.cwd(), "commands");
const commands = new Map();

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
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  // Auto View Status (placeholder)
  sock.ev.on("presence.update", async (presences) => {
    if (process.env.AUTO_VIEW_STATUS === "on") {
      // Add your auto view status logic here
    }
  });

  // Auto open view once messages
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
          console.log("Failed to auto-open view once message:", e);
        }
      }
    }
  });

  // Main message handler
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const m = messages[0];

    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;

    // Anti-link (remove user if they send links in groups)
    if (from.endsWith("@g.us") && process.env.ANTI_LINK === "on") {
      const text =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        "";

      const linkRegex = /(https?:\/\/[^\s]+)/gi;

      if (linkRegex.test(text.toLowerCase())) {
        // Check if bot is admin
        const metadata = await sock.groupMetadata(from);
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = metadata.participants.find(
          (p) => p.id === botNumber
        );

        if (botParticipant?.admin) {
          try {
            await sock.groupParticipantsUpdate(from, [sender], "remove");
            await sock.sendMessage(
              from,
              {
                text: `@${sender.split("@")[0]} has been removed for sending links!`,
                contextInfo: { mentionedJid: [sender] },
              }
            );
          } catch (err) {
            console.log("Failed to remove user:", err);
          }
        } else {
          console.log("Bot is not admin, can't remove members.");
        }

        return; // skip further processing
      }
    }

    // Command handler
    let body = "";
    if (m.message.conversation) body = m.message.conversation;
    else if (m.message.extendedTextMessage)
      body = m.message.extendedTextMessage.text;
    else return;

    if (!body.startsWith(PREFIX)) return;

    const args = body.slice(PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if (!commands.has(cmdName)) return;

    try {
      await commands.get(cmdName).execute(sock, m, args, from, sender);
    } catch (e) {
      console.error("Error executing command:", e);
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode || 0;
      if (statusCode !== 401) {
        console.log("Reconnecting...");
        startBot();
      } else {
        console.log("Session expired, please re-login.");
      }
    }
    if (connection === "open") {
      console.log("Bot connected.");
    }
  });
}

startBot();
