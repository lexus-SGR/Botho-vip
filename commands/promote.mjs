export default {
  name: "promote",
  description: "🔝 Promote member to admin / Fanya mtu admin",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🔝", key: msg.key } });

      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please tag the user to promote.\nTafadhali tag mtu wa kufanya admin." });
        return;
      }

      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) {
        await sock.sendMessage(from, { text: "⚠️ Please mention a valid user.\nTafadhali tag mtu halali." });
        return;
      }

      const userToPromote = mentioned[0];
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToPromote], "promote");
      await sock.sendMessage(from, { text: `✅ User promoted to admin: @${userToPromote.split("@")[0]}\nMtu amefanya admin.`, mentions: [userToPromote] });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to promote user.\nImeshindikana kumfanya admin." });
      console.error("Promote command error:", error);
    }
  },
};
