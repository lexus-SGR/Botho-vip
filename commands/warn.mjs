const warnLimit = 3;

// In-memory warn store: { groupId: { userId: count } }
const warns = {};

export default {
  name: "warn",
  description: "⚠️ Warn a user in group / Toa onyo kwa mtu kwenye group",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "⚠️", key: msg.key } });

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
        await sock.sendMessage(from, { text: "⚠️ Please tag or reply to the user you want to warn.\nTafadhali tag mtu au jibu meseji ya mtu unayetaka kutoa onyo." });
        return;
      }

      const userToWarn = mentioned[0];
      const groupId = msg.key.remoteJid;

      // Initialize warns for group if not present
      if (!warns[groupId]) warns[groupId] = {};

      // Initialize warn count for user
      if (!warns[groupId][userToWarn]) warns[groupId][userToWarn] = 0;

      // Increase warn count
      warns[groupId][userToWarn] += 1;

      const count = warns[groupId][userToWarn];

      if (count >= warnLimit) {
        // Kick user if reached warn limit
        await sock.groupParticipantsUpdate(groupId, [userToWarn], "remove");
        await sock.sendMessage(from, { 
          text: `❌ User @${userToWarn.split("@")[0]} has been removed after receiving ${warnLimit} warnings.\nMtu ameondolewa baada ya kupokea onyo ${warnLimit}.`,
          mentions: [userToWarn]
        });
        // Reset warn count after kick
        warns[groupId][userToWarn] = 0;
      } else {
        await sock.sendMessage(from, {
          text: `⚠️ User @${userToWarn.split("@")[0]} has been warned.\nOnyo lako ni ${count}/${warnLimit}.\nPlease behave!\nTafadhali jali tabia zako!`,
          mentions: [userToWarn]
        });
      }

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to issue warn.\nImeshindikana kutoa onyo." });
      console.error("Warn command error:", error);
    }
  },
};
