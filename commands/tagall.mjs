export default {
  name: "tagall",
  description: "Taja kila mshiriki wa group na info ya group",
  category: "group",
  usage: "😁tagall",
  async execute(sock, msg) {
    const { from, isGroup, key } = msg;

    if (!isGroup) {
      return await sock.sendMessage(from, {
        text: "⚠️ Amri hii inafanya kazi kwenye magroup pekee."
      }, { quoted: msg });
    }

    // Pata taarifa za group
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants;
    const groupName = groupMetadata.subject || "Group";
    const groupDesc = groupMetadata.desc || "🚫 Hakuna maelezo ya group.";
    const totalMembers = participants.length;

    // Andaa mentions
    const mentions = participants.map(p => p.id);
    const membersList = participants.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

    const caption = `*📛 Group:* ${groupName}\n` +
                    `*👥 Members:* ${totalMembers}\n` +
                    `*📝 Description:* ${groupDesc}\n\n` +
                    `*🔢 List of Members:*\n${membersList}`;

    // Tuma ujumbe
    await sock.sendMessage(from, {
      text: caption,
      mentions
    }, { quoted: msg });

    // Emoji react 📢
    await sock.sendMessage(from, {
      react: { text: "📢", key }
    });
  }
};
