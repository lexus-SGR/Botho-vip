const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  name: "cartoon",
  description: "Cartoonize an image using DeepAI",
  usage: "cartoon (reply to image)",
  category: "image",
  react: "🎨",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!msg.message.imageMessage && !msg.message.documentMessage) {
      return sock.sendMessage(from, { text: "❌ Please reply to an image." }, { quoted: msg });
    }

    try {
      await sock.sendMessage(from, { react: { text: "🎨", key: msg.key }});

      // Download the image buffer first (depends on your download function)
      const buffer = await sock.downloadMediaMessage(msg);

      const form = new FormData();
      form.append("image", buffer, "image.jpg");

      const res = await axios.post("https://api.deepai.org/api/toonify", form, {
        headers: {
          "api-key": process.env.DEEPAI_API_KEY,
          ...form.getHeaders(),
        },
      });

      const cartoonUrl = res.data.output_url;

      await sock.sendMessage(from, {
        image: { url: cartoonUrl },
        caption: "🎨 Here is your cartoonized image!",
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Failed to cartoonize the image." }, { quoted: msg });
    }
  }
};
