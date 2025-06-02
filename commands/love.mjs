const loveMessages = [
  "❤️ Nakupenda si kwa sababu wewe ni nani, bali kwa sababu mimi ni nani nikiwa na wewe.",
  "💌 Penzi la kweli halina mwisho. Kila siku ni mwanzo mpya.",
  "🌹 Upo mbali lakini moyo wangu unakuona kila siku.",
  "💕 Mapenzi yetu ni kama wimbo unaorudiwa – hauchoshi kamwe."
];

export default {
  name: "love",
  description: "Tuma meseji ya mapenzi ya nasibu 💘",
  category: "fun",
  usage: "!love",
  async execute(sock, msg) {
    const love = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: love }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "💘", key: msg.key } });
  }
};
