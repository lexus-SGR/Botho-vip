export default {
  name: "unban",
  description: "✅ Unban a user from bot / Rejesha mtu kutumia bot",
  async execute(sock, msg, args, from, bannedUsers) {
    try {
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please tag or reply to the user to unban.\nTafadhali tag mtu au jibu meseji ya mtu unayetaka kurejesha." });
        return;
      }

      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) {
        await sock.sendMessage(from, { text: "⚠️ Please mention a valid user.\nTafadhali tag mtu halali." });
        return;
      }

      const userToUnban = mentioned[0];

      if (!bannedUsers.has(userToUnban)) {
        await sock.sendMessage(from, { text: `❌ User @${userToUnban.split("@")[0]} is not banned.\nMtu hana marufuku.` , mentions: [userToUnban] });
        return;
      }

      bannedUsers.delete(userToUnban);

      await sock.sendMessage(from, { text: `✅ User @${userToUnban.split("@")[0]} has been unbanned.\nMtu ameondolewa marufuku.` , mentions: [userToUnban] });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to unban user.\nImeshindikana kumrejesha mtu." });
      console.error("Unban command error:", error);
    }
  },
};
