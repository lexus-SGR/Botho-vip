let antiLinkEnabled = false;

module.exports = {
  name: "antilink",
  description: "Enable/Disable anti-link 🚫",
  category: "security",
  usage: "antilink on/off",
  react: "🔗",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const option = args[0];
    if (option === "on") {
      antiLinkEnabled = true;
      await sock.sendMessage(from, { text: "✅ Anti-link is *enabled*" }, { quoted: msg });
    } else if (option === "off") {
      antiLinkEnabled = false;
      await sock.sendMessage(from, { text: "❌ Anti-link is *disabled*" }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: "Usage: antilink on/off" }, { quoted: msg });
    }
  }
};
