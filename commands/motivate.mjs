const quotes = [
  "🌟 Usikate tamaa – ndoto zako zinaweza kutimia!",
  "🔥 Changamoto ni nafasi ya kukua!",
  "💪 Kila siku mpya ni fursa mpya – tumia vyema!",
  "🚀 Unapojitahidi, hakuna lisilowezekana!"
];

export default {
  name: "motivate",
  description: "Toa nukuu ya kukutia moyo",
  category: "quotes",
  usage: "!motivate",
  async execute(sock, msg) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: quote }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "💡", key: msg.key }
    });
  }
};
