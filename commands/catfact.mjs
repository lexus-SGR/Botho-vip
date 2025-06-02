export default {
  name: "😁catfact",
  description: "Tuma fact za paka 🐱",
  category: "fun",
  usage: "!catfact",
  async execute(sock, msg) {
    const facts = [
      "Paka wana uwezo wa kuona usiku vizuri kuliko binadamu.",
      "Paka hutumia virai vyao kuwahamasisha wamiliki wao.",
      "Paka huchukua muda mwingi kupumzika kwa siku, hadi 16-20 saa.",
      "Paka wanapenda kujificha ili kujihami na wanyama wengine.",
      "Paka wana uwezo wa kusikia sauti zenye frequency kubwa zaidi."
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `🐱 Cat Fact:\n${fact}` }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🐱", key: msg.key } });
  }
};
