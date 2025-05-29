module.exports = {
  name: "unlockcmd",
  description: "Enable a locked command 🔓",
  category: "admin",
  usage: "unlockcmd <command>",
  react: "🔓",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const cmdName = args[0];
    if (!cmdName) return sock.sendMessage(from, { text: "❌ Enter the command name to unlock." }, { quoted: msg });

    lockedCommands.delete(cmdName.toLowerCase());
    await sock.sendMessage(from, { text: `🔓 Command *${cmdName}* has been unlocked.` }, { quoted: msg });
  }
};
