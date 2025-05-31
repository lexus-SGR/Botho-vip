let autoClear = {};

module.exports = {
  name: "autoclear",
  description: "Automatically delete bot messages after 10s 🧹",
  usage: "autoclear on / off",
  category: "security",
  react: "🧹",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
      return sock.sendMessage(from, { text: "🧹 Use `.autoclear on/off`" }, { quoted: msg });
    }

    autoClear[from] = status === "on";
    await sock.sendMessage(from, { text: `✅ Auto-clear is now *${status.toUpperCase()}*.` }, { quoted: msg });
  },

  // Function to send message with auto-clear if enabled
  async sendAutoClearMessage(sock, from, text) {
    if (autoClear[from]) {
      const sent = await sock.sendMessage(from, { text });
      setTimeout(() => {
        sock.sendMessage(from, { delete: sent.key });
      }, 10000);
    } else {
      await sock.sendMessage(from, { text });
    }
  }
};
