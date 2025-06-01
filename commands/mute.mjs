export default {
  name: "mute",
  description: "🔇 Mute group for specified seconds / Funga group kwa sekunde",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🔇", key: msg.key } });

      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please specify mute time in seconds.\nTafadhali toa muda wa kufunga (sekunde)." });
        return;
      }

      const seconds = parseInt(args[0], 10);
      if (isNaN(seconds) || seconds < 1) {
        await sock.sendMessage(from, { text: "⚠️ Invalid time specified.\nMuda sio sahihi." });
        return;
      }

      // Mute group by setting restrict to all non-admins
      await sock.groupSettingUpdate(msg.key.remoteJid, "announcement");
      await sock.sendMessage(from, { text: `🔇 Group muted for ${seconds} seconds.\nKundi limefungwa kwa sekunde ${seconds}.` });

      setTimeout(async () => {
        await sock.groupSettingUpdate(msg.key.remoteJid, "not_announcement");
        await sock.sendMessage(from, { text: "🔈 Group unmuted.\nKundi limefunguliwa tena." });
      }, seconds * 1000);

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error muting group.\nHitilafu wakati wa kufunga group." });
      console.error("Mute command error:", error);
    }
  },
};
