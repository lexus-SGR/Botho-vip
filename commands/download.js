const fetch = require("node-fetch");

module.exports = {
  name: "download",
  description: "Download any direct file from a link",
  usage: "download <file_url>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a direct file URL." }, { quoted: msg });

    const url = args[0];
    await sock.sendMessage(from, { text: "⏳ Downloading file..." }, { quoted: msg });

    try {
      if (url.match(/\.(jpg|jpeg|png|gif|mp4|mp3|pdf)$/i)) {
        if (url.match(/\.(mp4)$/i)) {
          await sock.sendMessage(from, { video: { url }, caption: "📹 Video file" }, { quoted: msg });
        } else if (url.match(/\.(mp3)$/i)) {
          await sock.sendMessage(from, { audio: { url }, caption: "🎵 Audio file" }, { quoted: msg });
        } else if (url.match(/\.(pdf)$/i)) {
          await sock.sendMessage(from, { document: { url }, mimetype: "application/pdf", caption: "📄 PDF file" }, { quoted: msg });
        } else {
          await sock.sendMessage(from, { image: { url }, caption: "🖼️ Image file" }, { quoted: msg });
        }
      } else {
        return sock.sendMessage(from, { text: "❌ Unsupported file type or invalid URL." }, { quoted: msg });
      }
    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error downloading file." }, { quoted: msg });
    }
  }
};
