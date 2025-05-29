module.exports = {
  name: "join",
  description: "Join a group using an invite link 📩",
  category: "admin",
  usage: "join <group link>",
  react: "📩",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const inviteLink = args[0];
    if (!inviteLink || !inviteLink.includes("whatsapp.com")) {
      return sock.sendMessage(from, { text: "❌ Provide a valid group invite link." }, { quoted: msg });
    }

    const code = inviteLink.split("whatsapp.com/")[1].trim();
    await sock.groupAcceptInvite(code);
    await sock.sendMessage(from, { text: "✅ Joined the group successfully!" }, { quoted: msg });
  }
};
