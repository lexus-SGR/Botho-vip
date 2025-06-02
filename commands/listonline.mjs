export default {
  name: "listonline",
  description: "Onyesha members wote wa group (hakuna data ya online realtime)",
  category: "group",
  usage: "😁listonline",
  async execute(sock, msg) {
    const { from, isGroup, key } = msg;

    if (!isGroup) {
      return await sock.sendMessage(from, {
        text: "⚠️ Amri hii inafanya kazi kwenye magroup tu!"
      }, { quoted: msg });
    }

    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;
      const groupName = groupMetadata.subject || "Group";

      const membersList = participants
        .map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`)
        .join("\n");

      const text = `📛 *Group:* ${groupName}\n👥 *Members (${participants.length}):*\n\n${membersList}`;

      const mentions = participants.map(p => p.id);

      await sock.sendMessage(from, {
        text,
        mentions
      }, { quoted: msg });

      await sock.sendMessage(from, {
        react: { text: "✅", key }
      });

    } catch (err) {
      console.error("Error in listonline:", err);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu ilitokea kuonyesha list ya members."
      }, { quoted: msg });
    }
  }
};
