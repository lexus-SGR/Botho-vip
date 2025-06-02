export default {
  name: "😁dogfact",
  description: "Tuma fact za mbwa 🐶",
  category: "fun",
  usage: "!dogfact",
  async execute(sock, msg) {
    const facts = [
      "Mbwa wana hisia kali za kunusa na kusikia.",
      "Mbwa wanawasha hisia nzuri kwa wamiliki wao.",
      "Mbwa hutambua sauti za wamiliki wao zaidi kuliko sauti za wengine.",
      "Mbwa wanaweza kujifunza amri mpya haraka.",
      "Mbwa wanapenda kucheza na watu."
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: `🐶 Dog Fact:\n${fact}` }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🐶", key: msg.key } });
  }
};
