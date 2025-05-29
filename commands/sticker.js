const { writeFile } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { fromBuffer } = require('file-type');

module.exports = {
  name: "sticker",
  description: "Convert an image to a sticker 🖼️",
  category: "media",
  react: "🖼️",
  usage: "sticker",
  async execute(sock, msg, args, from, sender) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
      return sock.sendMessage(from, { text: "❌ Please reply to an image to convert it to a sticker." }, { quoted: msg });
    }

    const media = await sock.downloadMediaMessage({ message: quoted });
    const tempFilePath = path.join(tmpdir(), `image_${Date.now()}.jpg`);
    await writeFile(tempFilePath, media);

    await sock.sendMessage(from, { sticker: { url: tempFilePath } }, { quoted: msg });
  }
};
