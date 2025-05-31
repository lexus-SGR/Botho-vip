module.exports = {
  name: "statusdl",
  description: "Download WhatsApp status (story) of a user",
  usage: "statusdl @user",
  async execute(sock, msg, args, from, sender) {
    const mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mention) return sock.sendMessage(from, { text: "🚩 Please tag the user to download their status." }, { quoted: msg });

    try {
      // Hypothetical function - depends on your WhatsApp library
      const statuses = await sock.fetchStatus(mention);
      if (!statuses || statuses.length === 0) return sock.sendMessage(from, { text: "❌ User has no status available." }, { quoted: msg });

      for (const status of statuses) {
        if (status.type === "video") {
          await sock.sendMessage(from, { video: { url: status.url }, caption: "📹 Status video" }, { quoted: msg });
        } else {
          await sock.sendMessage(from, { image: { url: status.url }, caption: "📸 Status photo" }, { quoted: msg });
        }
      }
    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error occurred while downloading status." }, { quoted: msg });
    }
  }
};
