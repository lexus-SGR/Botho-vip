module.exports = {
  name: "setbio",
  description: "Change the bot's status/bio 💬",
  category: "admin",
  usage: "setbio <status>",
  react: "💬",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const newBio = args.join(" ");
    if (!newBio) return sock.sendMessage(from, { text: "❌ Please provide a new bio." }, { quoted: msg });

    await sock.updateProfileStatus(newBio);
    await sock.sendMessage(from, { text: "✅ Bio updated successfully!" }, { quoted: msg });
  }
};
