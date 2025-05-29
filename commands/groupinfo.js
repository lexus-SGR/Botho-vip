module.exports = {
  name: "groupinfo",
  description: "Display group information 📊",
  usage: "groupinfo",
  category: "security",
  react: "📊",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup, groupMetadata) {
    if (!isGroup) return sock.sendMessage(from, { text: "👥 Only in groups." }, { quoted: msg });

    const info = `👥 *Group Name:* ${groupMetadata.subject}
🧑‍🤝‍🧑 *Members:* ${groupMetadata.participants.length}
📝 *Description:* ${groupMetadata.desc || "N/A"}
👤 *Created by:* ${groupMetadata.owner.split("@")[0]}
📅 *Created at:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}`;

    await sock.sendMessage(from, { text: info }, { quoted: msg });
  }
};
