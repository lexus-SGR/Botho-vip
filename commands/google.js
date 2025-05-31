const axios = require("axios");

module.exports = {
  name: "google",
  description: "Search Google using SerpAPI",
  usage: "google <search query>",
  category: "search",
  react: "🔍",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Enter a search query." }, { quoted: msg });

    const query = args.join(" ");
    try {
      await sock.sendMessage(from, { react: { text: "🔍", key: msg.key }});

      const apiKey = process.env.SERPAPI_KEY;
      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;

      const res = await axios.get(url);
      const results = res.data.organic_results;

      if (!results || results.length === 0) {
        return sock.sendMessage(from, { text: "❌ No results found." }, { quoted: msg });
      }

      let responseText = `🔍 Google Search Results for: *${query}*\n\n`;
      results.slice(0, 5).forEach((r, i) => {
        responseText += `${i + 1}. ${r.title}\n${r.snippet || ""}\n${r.link}\n\n`;
      });

      await sock.sendMessage(from, { text: responseText.trim() }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Google Search API error." }, { quoted: msg });
    }
  }
};
