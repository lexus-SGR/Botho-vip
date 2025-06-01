export default {
  name: "setdesc",
  description: "✏️ Set group description / Badilisha maelezo ya group",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "✏️", key: msg.key } });

      if (!msg.key.remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(from, { text: "⚠️ This command works only in groups.\nAmri hii inatumika tu kwenye group." });
        return;
      }

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please provide the new group description.\nTafadhali andika maelezo mapya ya group." });
        return;
      }

      const newDesc = args.join(" ");

      await sock.groupUpdateDescription(from, newDesc);

      await sock.sendMessage(from, { text: "✅ Group description updated.\nMaelezo ya group yamebadilishwa." });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to update group description.\nImeshindikana kubadilisha maelezo ya group." });
      console.error("Setdesc command error:", error);
    }
  },
};
