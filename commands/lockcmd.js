let lockedCommands = new Set();

module.exports = {
  name: "lockcmd",
  description: "Disable a command temporarily 🔒",
  category: "admin",
  usage: "lockcmd <command>",
  react: "🔒",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const cmdName = args[0];
    if (!cmdName) return sock.sendMessage(from, { text: "❌ Enter the command name to lock." }, { quoted: msg });

    lockedCommands.add(cmdName.toLowerCase());
    await sock.sendMessage(from, { text: `🔒 Command *${cmdName}* has been locked.` }, { quoted: msg });
  }
};
