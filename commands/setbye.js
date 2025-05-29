let byeMessages = {};

module.exports = {
  name: "setbye",
  description: "Set goodbye message 👋",
  usage: "setbye Bye @user!",
  category: "security",
  react: "👋",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "👥 Groups only." }, { quoted: msg });
    const text = args.join(" ");
    if (!text.includes("@user")) return sock.sendMessage(from, { text: "✍️ Include '@user' placeholder in your message." }, { quoted: msg });

    byeMessages[from] = text;
    await sock.sendMessage(from, { text: "✅ Goodbye message set." }, { quoted: msg });
  }
};
