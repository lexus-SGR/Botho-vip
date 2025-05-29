module.exports = {
  name: "demote",
  description: "Demote a user from admin 🔻",
  usage: "demote @user",
  category: "security",
  react: "🔻",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    const mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!isGroup || !mention) return sock.sendMessage(from, { text: "👤 Tag someone in group." }, { quoted: msg });
    await sock.groupParticipantsUpdate(from, [mention], "demote");
    await sock.sendMessage(from, { text: `🔻 @${mention.split("@")[0]} demoted from admin.`, mentions: [mention] }, { quoted: msg });
  }
};
