module.exports = {
  name: "listonline",
  description: "List all online members in the group 👥",
  usage: "listonline",
  category: "group",
  react: "👥",
  sudo: false,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command works only in groups!" }, { quoted: msg });

    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;

      // Filter participants with presence online
      const onlineMembers = participants.filter(p => p.presence === "online");

      if (onlineMembers.length === 0) {
        return await sock.sendMessage(from, { text: "No members are online right now." }, { quoted: msg });
      }

      const onlineList = onlineMembers.map(p => `@${p.id.split("@")[0]}`).join("\n");

      await sock.sendMessage(from, {
        text: `👥 *Online members:*\n${onlineList}`,
        mentions: onlineMembers.map(p => p.id)
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: "Failed to fetch online members." }, { quoted: msg });
    }
  }
};
