module.exports = {
  name: "block",
  description: "Block a specific user 🚫",
  category: "admin",
  usage: "block <@tag or number>",
  react: "🚫",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0];
    if (!mentioned) return sock.sendMessage(from, { text: "❌ Please mention or enter a number to block." }, { quoted: msg });

    const jid = mentioned.includes("@s.whatsapp.net") ? mentioned : `${mentioned}@s.whatsapp.net`;
    await sock.updateBlockStatus(jid, "block");
    await sock.sendMessage(from, { text: `🚫 User ${jid} has been blocked.` }, { quoted: msg });
  }
};
