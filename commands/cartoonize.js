const axios = require("axios");

module.exports = {
  name: "cartoonize",
  description: "Transform image to cartoon using DeepAI",
  usage: "cartoonize <image_url>",
  category: "image",
  react: "🤖",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide image URL." }, { quoted: msg });

    const imageUrl = args[0];
    try {
      await sock.sendMessage(from, { react: { text: "🤖", key: msg.key } });

      const response = await axios.post("https://api.deepai.org/api/toonify", 
        { image: imageUrl },
        { headers: { "api-key": process.env.DEEPAI_API_KEY } }
      );

      if (!response.data.output_url) 
        return sock.sendMessage(from, { text: "❌ Failed to cartoonize image." }, { quoted: msg });

      await sock.sendMessage(from, { image: { url: response.data.output_url }, caption: "🤖 Cartoonized Image" }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error during cartoonizing." }, { quoted: msg });
    }
  }
};
