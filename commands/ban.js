let bannedUsers = new Set();

module.exports = {
  name: "ban",
  description: "Globally ban a user 🚫",
  category: "admin",
  usage: "ban @user",
  react: "🚫",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(from, { text: "❌ Mention a user to ban." }, { quoted: msg });

    bannedUsers.add(mentioned);
    await sock.sendMessage(from, { text: `🚫 User ${mentioned.split("@")[0]} has been banned.` }, { quoted: msg });
  }
};
