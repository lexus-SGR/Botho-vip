export default {
  name: "ban",
  description: "⛔ Ban a user from using the bot / Zuia mtu kutumia bot",
  async execute(sock, msg, args, from, bannedUsers) {
    try {
      await sock.sendMessage(from, { react: { text: "⛔", key: msg.key } });

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please tag or reply to the user to ban.\nTafadhali tag mtu au jibu meseji ya mtu unayetaka kumzuia." });
        return;
      }

      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) {
        await sock.sendMessage(from, { text: "⚠️ Please mention a valid user.\nTafadhali tag mtu halali." });
        return;
      }

      const userToBan = mentioned[0];

      if (bannedUsers.has(userToBan)) {
        await sock.sendMessage(from, { text: `❌ User @${userToBan.split("@")[0]} is already banned.\nMtu tayari amezuia.` , mentions: [userToBan] });
        return;
      }

      bannedUsers.add(userToBan);

      await sock.sendMessage(from, { text: `✅ User @${userToBan.split("@")[0]} has been banned from using the bot.\nMtu amezuia kutumia bot.` , mentions: [userToBan] });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to ban user.\nImeshindikana kumzuia mtu." });
      console.error("Ban command error:", error);
    }
  },
};
