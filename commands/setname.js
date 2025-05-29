module.exports = {
  name: "setname",
  description: "Change the bot's name 📝",
  category: "admin",
  usage: "setname <new name>",
  react: "📝",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const newName = args.join(" ");
    if (!newName) return sock.sendMessage(from, { text: "❌ Please provide a new name." }, { quoted: msg });

    await sock.updateProfileStatus(newName);
    await sock.sendMessage(from, { text: `✅ Bot name changed to *${newName}*.` }, { quoted: msg });
  }
};
