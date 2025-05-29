module.exports = {
  name: "checkuser",
  description: "Check user info in group 🔍",
  usage: "checkuser @user",
  category: "security",
  react: "🕵️",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup, groupMetadata) {
    if (!isGroup) return await sock.sendMessage(from, { text: "🛑 Group only." }, { quoted: msg });

    const mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mention) return await sock.sendMessage(from, { text: "🔖 Tag a user to check." }, { quoted: msg });

    const contact = await sock.onWhatsApp(mention);
    const status = await sock.fetchStatus(mention);
    const name = contact[0]?.notify || "N/A";

    const info = `👤 *User Info*\n\n• Name: ${name}\n• Number: ${mention.split("@")[0]}\n• Status: ${status?.status || "Unknown"}`;

    await sock.sendMessage(from, { text: info }, { quoted: msg });
  }
};
