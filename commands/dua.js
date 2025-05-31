// dua.js
const duas = [
  {
    text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
    meaning: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    category: "General"
  },
  {
    text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika min al-hammi wal-hazan",
    meaning: "O Allah, I seek refuge in You from anxiety and sorrow.",
    category: "Supplication"
  }
];

module.exports = {
  name: "dua",
  description: "Send a random dua with meaning 🙏",
  usage: "dua",
  category: "islamic",
  react: "🙏",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const random = Math.floor(Math.random() * duas.length);
    const dua = duas[random];
    const text = `🙏 *Dua*\n\nArabic:\n${dua.text}\n\nTransliteration:\n${dua.transliteration}\n\nMeaning:\n${dua.meaning}`;
    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
