export default {
  name: "unmute",
  description: "🔈 Unmute group / Fungua group",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🔈", key: msg.key } });

      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      await sock.groupSettingUpdate(msg.key.remoteJid, "not_announcement");
      await sock.sendMessage(from, { text: "✅ Group unmuted.\nKundi limefunguliwa tena." });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error unmuting group.\nHitilafu wakati wa kufungua group." });
      console.error("Unmute command error:", error);
    }
  },
};
