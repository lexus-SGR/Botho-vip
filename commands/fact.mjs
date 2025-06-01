// commands/fact.mjs
import fetch from "node-fetch";

export default {
  name: "😁fact",
  description: "Get a fun fact 🧠",
  category: "fun",
  async execute(sock, msg) {
    const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    const data = await res.json();
    await sock.sendMessage(msg.key.remoteJid, { text: `💡 ${data.text}` }, { quoted: msg });
  }
};
