export default {
  name: "listonline",
  description: "Onesha members walio online kwenye group",
  category: "group",
  usage: "😁listonline",
  async execute(sock, msg) {
    const { from, isGroup, key } = msg;

    if (!isGroup) {
      return await sock.sendMessage(from, {
        text: "⚠️ Amri hii inafanya kazi kwenye magroup tu!"
      }, { quoted: msg });
    }

    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants;

    let onlineMembers = [];

    for (let user of participants) {
      try {
        const presence = await sock.presenceSubscribe(user.id);
        if (presence && presence.lastKnownPresence === "available") {
          onlineMembers.push(user.id);
        }
      } catch (e) {
        // Skip kama kuna error kwa mtu mmoja
      }
    }

    if (onlineMembers.length === 0) {
      return await sock.sendMessage(from, {
        text: "🙁 Hakuna aliye online kwa sasa."
      }, { quoted: msg });
    }

    const mentionList = onlineMembers.map((id, i) => `${i + 1}. @${id.split("@")[0]}`).join("\n");

    await sock.sendMessage(from, {
      text: `📶 *Online Members (${onlineMembers.length}):*\n\n${mentionList}`,
      mentions: onlineMembers
    }, { quoted: msg });

    await sock.sendMessage(from, {
      react: { text: "✅", key }
    });
  }
};
