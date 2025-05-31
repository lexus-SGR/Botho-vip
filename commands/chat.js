const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  name: "chat",
  description: "Chat with AI (OpenAI ChatGPT)",
  usage: "chat <your message>",
  category: "ai",
  react: "🤖",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) {
      return sock.sendMessage(from, { text: "❌ Please enter a message to chat." }, { quoted: msg });
    }

    const prompt = args.join(" ");

    try {
      await sock.sendMessage(from, { react: { text: "🤖", key: msg.key }});
      const response = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const answer = response.data.choices[0].message.content;
      await sock.sendMessage(from, { text: answer }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error from OpenAI. Please try again later." }, { quoted: msg });
    }
  }
};
