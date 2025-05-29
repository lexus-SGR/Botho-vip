let welcomeMessages = {};

module.exports = {
  name: "setwelcome",
  description: "Set custom welcome message 🎉",
  usage: "setwelcome Welcome @user to our group!",
  category: "security",
  react: "🎉",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "🏠 Only for groups." }, { quoted: msg });
    const text = args.join(" ");
    if (!text.includes("@user")) return sock.sendMessage(from, { text: "✍️ Include '@user' placeholder in your message." }, { quoted: msg });

    welcomeMessages[from] = text;
    await sock.sendMessage(from, { text: "✅ Welcome message set successfully." }, { quoted: msg });
  }
};
