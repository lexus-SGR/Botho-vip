module.exports = {
  name: "bismillah",
  description: "Send Bismillah in Arabic and English",
  category: "islamic",
  usage: "!bismillah",
  react: "🕋",
  async execute(sock, msg, args, from) {
    const text = `بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ\nIn the name of Allah, the Most Gracious, the Most Merciful.`;
    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
