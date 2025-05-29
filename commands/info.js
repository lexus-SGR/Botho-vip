const os = require("os");

module.exports = {
  name: "info",
  description: "System info of the bot 🧠",
  category: "owner",
  usage: "info",
  react: "🧠",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const uptime = process.uptime();
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;

    let text = `🔧 *Bot Info* 🔧\n`;
    text += `Uptime: ${Math.floor(uptime)} sec\n`;
    text += `RAM Usage: ${memory.toFixed(2)} MB\n`;
    text += `Platform: ${os.platform()}\n`;
    text += `CPU: ${os.cpus()[0].model}`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
