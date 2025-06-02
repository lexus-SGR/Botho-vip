import fetch from "node-fetch";

export default {
  name: "😁meme",
  description: "Tuma meme random za kuchekesha 😂",
  category: "fun",
  usage: "!meme",
  async execute(sock, msg) {
    try {
      const res = await fetch("https://meme-api.com/gimme");
      const json = await res.json();

      if (!json || !json.url) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Samahani, hakuna meme kwa sasa." }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: json.url },
        caption: `😂 Meme:\n${json.title}`
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: "🤣", key: msg.key } });

    } catch (error) {
      console.error("Error fetching meme:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta meme. Jaribu tena." });
    }
  }
};
