export default {
  name: "😁status",
  description: "Badilisha bio/status yako ya WhatsApp ✍️",
  category: "status",
  usage: "!status i am a boss",
  async execute(sock, msg, args) {
    if (!args.length) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "✍️ Tumia mfano: `😁status I am a boss` ili kubadilisha bio yako.",
      }, { quoted: msg });
    }

    const newStatus = args.join(" ");
    try {
      await sock.updateProfileStatus(newStatus);

      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ Bio yako imewekwa kuwa:\n👉 *${newStatus}*`,
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "💼", key: msg.key }
      });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Imeshindikana kubadilisha status. Hakikisha unatumia WhatsApp Business au ina ruhusa.",
      }, { quoted: msg });
    }
  }
};
