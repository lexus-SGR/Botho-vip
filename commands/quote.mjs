const quotes = [
  "Maisha ni safari, furahia kila hatua.",
  "Kushindwa ni sehemu ya mafanikio.",
  "Kuwa mabadiliko unayotaka kuona dunia ikiyafanya.",
  "Hakuna mafanikio bila jitihada.",
  "Ndoto ni mwanzo wa mafanikio.",
];

export default {
  name: "quote",
  description: "Toa mafumbo ya kuhamasisha",
  category: "fun",
  usage: "!quote",
  async execute(sock, msg) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `💡 Quote:\n\n"${randomQuote}"` }, { quoted: msg });
  }
};
