module.exports = {
  name: "shutdown",
  description: "Shuts down the bot completely 🔌",
  category: "admin",
  usage: "shutdown",
  react: "🛑",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    await sock.sendMessage(from, { text: "🛑 Shutting down the bot... Goodbye!" }, { quoted: msg });
    process.exit(0);
  }
};
