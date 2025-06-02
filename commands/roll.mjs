export default {
  name: "roll",
  description: "Tupa kete – bahati nasibu kutoka 1 hadi 6 🎲",
  category: "fun",
  usage: "!roll",
  async execute(sock, msg) {
    const dice = Math.floor(Math.random() * 6) + 1;
    await sock.sendMessage(msg.key.remoteJid, { text: `🎲 Umetupa kete na kupata: *${dice}*` }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🎯", key: msg.key } });
  }
};
