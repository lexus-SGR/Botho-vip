export default {
  name: "kick",
  description: "🚫 Remove a member from group / Toa mtu kwenye group",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🚫", key: msg.key } });

      // Check if group message
      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      // Get mentioned users if any
      let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      // If no mentions, try get user from replied message
      if (!mentioned.length) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted) {
          const participant = msg.message.extendedTextMessage.contextInfo.participant;
          if (participant) mentioned = [participant];
        }
      }

      if (!mentioned.length) {
        await sock.sendMessage(from, { text: "⚠️ Please tag or reply to the user you want to kick.\nTafadhali tag mtu au jibu meseji ya mtu unayetaka kumtoa." });
        return;
      }

      const userToKick = mentioned[0];

      // Remove user from group
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToKick], "remove");
      await sock.sendMessage(from, { text: `✅ User removed: @${userToKick.split("@")[0]}\nMtu ameondolewa.` , mentions: [userToKick] });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to remove user.\nImeshindikana kumtoa mtu." });
      console.error("Kick command error:", error);
    }
  },
};
