const hadiths = [
  {
    source: "Sahih Bukhari",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Actions are judged by intentions."
  },
  {
    source: "Sahih Muslim",
    arabic: "الدِّينُ النَّصِيحَةُ",
    translation: "The religion is sincerity."
  }
];

module.exports = {
  name: "hadith",
  description: "Get a random Hadith 📜",
  category: "islamic",
  usage: "!hadith",
  react: "📜",
  async execute(sock, msg, args, from) {
    const h = hadiths[Math.floor(Math.random() * hadiths.length)];
    const text = `📖 *Hadith (${h.source})*\n\n🕋 Arabic: ${h.arabic}\n💬 Translation: ${h.translation}`;
    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
