export default {
  name: "downloadsticker",
  description: "Download sticker (webp) kutoka reply",
  category: "download",
  usage: "!downloadsticker (reply sticker)",
  async execute(sock, msg) {
    const { from, quoted, key } = msg;

    try {
      if (!quoted || !quoted.message.stickerMessage) {
        return await sock.sendMessage(from, { text: "Tafadhali reply sticker ili kudownload." }, { quoted: msg });
      }

      const buffer = await sock.downloadMediaMessage(quoted);
      // Send sticker file as document to allow download
      await sock.sendMessage(from, { document: buffer, mimetype: "image/webp", fileName: "sticker.webp" }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "📥", key } });

    } catch (e) {
      await sock.sendMessage(from, { text: "Kuna tatizo kudownload sticker." }, { quoted: msg });
    }
  }
};
