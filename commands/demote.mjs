export default {
  name: "demote",
  description: "📉 Remove admin status / Toa admin",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "📉", key: msg.key } });

      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please tag the admin to demote.\nTafadhali tag admin wa kumtoa." });
        return;
      }

      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) {
        await sock.sendMessage(from, { text: "⚠️ Please mention a valid admin.\nTafadhali tag admin halali." });
        return;
      }

      const userToDemote = mentioned[0];
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToDemote], "demote");
      await sock.sendMessage(from, { text: `✅ User demoted: @${userToDemote.split("@")[0]}\nAdmin ametoa hadhi.`, mentions: [userToDemote] });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to demote user.\nImeshindikana kumtoa admin." });
      console.error("Demote command error:", error);
    }
  },
};
