module.exports = {
  name: "host",
  description: "Show hosting environment info 🖥️",
  usage: "host",
  category: "info",
  react: "🖥️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const hostInfo = `🖥️ *Hosting Environment:*\nLinux VPS on Render Platform\nStable and reliable server for BEN WHITTAKER TECH BOT.`;
    await sock.sendMessage(from, { text: hostInfo }, { quoted: msg });
  }
};
