module.exports = {
  name: "getpp",
  description: "Fetch user’s profile picture 📸",
  category: "utility",
  usage: "getpp @user",
  react: "📸",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
    const url = await sock.profilePictureUrl(mentioned, "image");

    await sock.sendMessage(from, { image: { url }, caption: "📸 Here is the profile picture." }, { quoted: msg });
  }
};
