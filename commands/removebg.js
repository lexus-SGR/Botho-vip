const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  name: "removebg",
  description: "Remove background from an image",
  usage: "removebg (reply to image)",
  category: "image",
  react: "🖼️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!msg.message.imageMessage && !msg.message.documentMessage) {
      return sock.sendMessage(from, { text: "❌ Please reply to an image." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(from, { react: { text: "🖼️", key: msg.key }});

      const buffer = await sock.downloadMediaMessage(msg);

      const form = new FormData();
      form.append("image_file", buffer, "image.jpg");

      const res = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_KEY,
          ...form.getHeaders(),
        },
        responseType: "arraybuffer"
      });

      await sock.sendMessage(from, {
        image: res.data,
        mimetype: "image/png",
        caption: "🖼️ Background removed!"
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Failed to remove background." }, { quoted: msg });
    }
  }
};
