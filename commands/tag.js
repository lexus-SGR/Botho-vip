module.exports = {
  name: "tag",
  description: "Mention all group members 🧨",
  usage: "tag",
  category: "security",
  react: "📢",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup, groupMetadata) {
    if (!isGroup) return sock.sendMessage(from, { text: "👥 Group only." }, { quoted: msg });
    
    const mentions = groupMetadata.participants.map(p => p.id);
    const mentionText = mentions.map(u => `@${u.split("@")[0]}`).join(" ");
    await sock.sendMessage(from, { text: `📢 ${mentionText}`, mentions }, { quoted: msg });
  }
};
