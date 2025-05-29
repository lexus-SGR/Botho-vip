const os = require("os");

module.exports = {
  name: "platform",
  description: "Show system platform info 🖥️",
  usage: "platform",
  category: "info",
  react: "🖥️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const platformInfo = `🖥️ *Platform Information:*\n${os.type()} ${os.release()} (${os.arch()})`;
    await sock.sendMessage(from, { text: platformInfo }, { quoted: msg });
  }
};
