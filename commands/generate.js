const axios = require("axios");

module.exports = {
  name: "generate",
  description: "Generate image with Stability AI",
  usage: "generate <prompt>",
  category: "image",
  react: "🖼️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Enter a prompt to generate image." }, { quoted: msg });

    const prompt = args.join(" ");
    try {
      await sock.sendMessage(from, { react: { text: "🖼️", key: msg.key }});

      const res = await axios.post("https://api.stability.ai/v1/generation/stable-diffusion-v1-4/text-to-image", {
        prompt: prompt,
        width: 512,
        height: 512,
        samples: 1,
        steps: 30,
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const imageUrl = res.data.artifacts[0].url;

      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption: `🖼️ Generated image for prompt: *${prompt}*`
      }, { quoted: msg });

    } catch (error) {
      console.error(error.response?.data || error.message);
      await sock.sendMessage(from, { text: "⚠️ Failed to generate image." }, { quoted: msg });
    }
  }
};
