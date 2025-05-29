module.exports = {
  name: "render",
  description: "Show Render platform info ☁️",
  usage: "render",
  category: "info",
  react: "☁️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const renderInfo = `☁️ *Render Platform:*\nA cloud platform for hosting apps, providing scalable infrastructure with uptime and speed.`;
    await sock.sendMessage(from, { text: renderInfo }, { quoted: msg });
  }
};
