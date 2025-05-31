// quran.js
const quranSample = {
  "1": { // Surah Al-Fatiha
    "1": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    "2": "All praise is [due] to Allah, Lord of the worlds -",
    "3": "The Entirely Merciful, the Especially Merciful,",
    "4": "Sovereign of the Day of Recompense.",
    "5": "It is You we worship and You we ask for help.",
    "6": "Guide us to the straight path -",
    "7": "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
  }
};

module.exports = {
  name: "quran",
  description: "Get Quran verse by Surah and Ayah number 📖",
  usage: "quran <surah_number> <ayah_number>",
  category: "islamic",
  react: "📖",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (args.length < 2) {
      return sock.sendMessage(from, { text: "❌ Usage: quran <surah_number> <ayah_number>\nExample: quran 1 3" }, { quoted: msg });
    }
    const surah = args[0];
    const ayah = args[1];

    if (!quranSample[surah] || !quranSample[surah][ayah]) {
      return sock.sendMessage(from, { text: "❌ Verse not found in sample database." }, { quoted: msg });
    }

    const verse = quranSample[surah][ayah];
    const text = `📖 Surah ${surah}, Ayah ${ayah}:\n\n${verse}`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
