import fetch from "node-fetch";

const TENOR_API_KEY = process.env.TENOR_API_KEY;

const jokes = [
  "Kwa nini mbwa hawezi kucheza piano? Kwa sababu hana vidole vya kutosha!",
  "Nani aliyeleta daktari kwenye klabu? Kwa sababu alikuwa na matatizo ya heartbeat!",
  "Kuku alienda shule, akatoka na A+! Kwani alikuwa na mayai ya maana!",
];

export default {
  name: "😁joke",
  description: "Tuma joke ya kuchekesha pamoja na GIF 😂",
  category: "fun",
  async execute(sock, msg, args) {
    try {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];

      const url = `https://tenor.googleapis.com/v2/search?q=funny&key=${TENOR_API_KEY}&limit=1&media_filter=gif`;
      const response = await fetch(url);
      const json = await response.json();

      const gifUrl = json.results && json.results[0] ? json.results[0].media_formats.gif.url : null;

      let message = {
        text: joke
      };

      if (gifUrl) {
        message = {
          video: { url: gifUrl },
          gifPlayback: true,
          caption: joke,
        };
      }

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (error) {
      console.error("Error in !joke command:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta joke. Jaribu tena." }, { quoted: msg });
    }
  }
};
