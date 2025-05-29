const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "setpp",
  description: "Set the bot's profile picture 🖼️",
  category: "admin",
  usage: "setpp (reply to an image)",
  react: "🖼️",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
      return sock.sendMessage(from, { text: "❌ Please reply to an image to set as profile picture." }, { quoted: msg });
    }

    const buffer = await downloadMediaMessage({ message: quoted });
    await sock.updateProfilePicture(sock.user.id, buffer);
    await sock.sendMessage(from, { text: "✅ Profile picture updated!" }, { quoted: msg });
  }
};
