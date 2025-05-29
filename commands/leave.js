module.exports = {
  name: "leave",
  description: "Bot leaves the current group 👋",
  category: "admin",
  usage: "leave",
  react: "👋",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    await sock.sendMessage(from, { text: "👋 Goodbye everyone!" }, { quoted: msg });
    await sock.groupLeave(from);
  }
};
