export default {
  name: "tagall",
  description: "📢 Taja kila mshiriki wa group pamoja na info ya group",
  async execute(sock, msg, args, from) {
    try {
      const isGroup = from.endsWith("@g.us");
      if (!isGroup) {
        return await sock.sendMessage(from, {
          text: "⚠️ Amri hii inafanya kazi kwenye magroup pekee."
        }, { quoted: msg });
      }

      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;
      const groupName = groupMetadata.subject || "📛 Group";
      const groupDesc = groupMetadata.desc || "🚫 Hakuna maelezo ya group.";
      const totalMembers = participants.length;

      // Tayarisha mentions na list
      const mentions = participants.map(p => p.id);
      const membersList = participants
        .map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`)
        .join("\n");

      const caption = `*📛 Group:* ${groupName}\n` +
                      `*👥 Members:* ${totalMembers}\n` +
                      `*📝 Description:* ${groupDesc}\n\n` +
                      `*🔢 List of Members:*\n${membersList}`;

      await sock.sendMessage(from, {
        text: caption,
        mentions
      }, { quoted: msg });

      await sock.sendMessage(from, {
        react: { text: "📢", key: msg.key }
      });

    } catch (error) {
      console.error("❌ Tagall Error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kutumia tagall."
      }, { quoted: msg });
    }
  }
};
