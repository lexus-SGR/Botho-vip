let antiDeleteEnabled = false;

module.exports = {
  name: "antidelete",
  description: "Enable or disable anti-delete feature 📛",
  category: "security",
  usage: "antidelete on/off",
  react: "🛑",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const option = args[0];
    if (option === "on") {
      antiDeleteEnabled = true;
      await sock.sendMessage(from, { text: "✅ Anti-delete is now *enabled*" }, { quoted: msg });
    } else if (option === "off") {
      antiDeleteEnabled = false;
      await sock.sendMessage(from, { text: "❌ Anti-delete is now *disabled*" }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: "Usage: antidelete on/off" }, { quoted: msg });
    }
  }
};
