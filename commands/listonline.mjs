export default {
  name: "listonline",
  description: "Onesha members walio online kwenye group",
  category: "group",
  usage: "!listonline",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const isGroup = msg.key.remoteJid.endsWith("@g.us");

    if (!isGroup) {
      // React na emoji ❌, halafu tuma message
      await sock.sendMessage(from, {
        react: { text: "❌", key: msg.key }
      });
      return await sock.sendMessage(from, {
        text: "⚠️ Amri hii inafanya kazi kwenye magroup tu!"
      }, { quoted: msg });
    }

    try {
      // Chukua group metadata
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;

      let onlineMembers = [];

      // Jumla ya participants
      for (const user of participants) {
        try {
          // Subscribe presence, kisha angalia kama online
          const presence = await sock.presenceSubscribe(user.id);

          // Presence huja na lastKnownPresence au state
          if (presence?.lastKnownPresence === "available") {
            onlineMembers.push(user.id);
          }
        } catch {
          // Skip mtu kama kuna error, usizuie loop
        }
      }

      if (onlineMembers.length === 0) {
        await sock.sendMessage(from, {
          react: { text: "😔", key: msg.key }
        });
        return await sock.sendMessage(from, {
          text: "🙁 Hakuna aliye online kwa sasa."
        }, { quoted: msg });
      }

      // Tengeneza orodha ya mentions kwa nambari
      const mentionList = onlineMembers
        .map((id, i) => `🔹 ${i + 1}. @${id.split("@")[0]}`)
        .join("\n");

      // Tuma message na mentions na reaction nzuri
      await sock.sendMessage(from, {
        text: `📶 *Online Members (${onlineMembers.length}):*\n\n${mentionList}`,
        mentions: onlineMembers
      }, { quoted: msg });

      // React kwa emoji ya success
      await sock.sendMessage(from, {
        react: { text: "✅", key: msg.key }
      });

    } catch (error) {
      await sock.sendMessage(from, {
        react: { text: "⚠️", key: msg.key }
      });
      await sock.sendMessage(from, {
        text: "⚠️ Tatizo lilitokea kuangalia online members. Jaribu tena baadaye."
      }, { quoted: msg });
      console.error("Error in listonline command:", error);
    }
  }
};
