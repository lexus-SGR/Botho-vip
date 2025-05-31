// tafseer.js
const tafseerSample = {
  "1": {
    "1": "This verse means that all actions must begin with the name of Allah, acknowledging His mercy and kindness.",
    "2": "Praise and thanks are due to Allah alone, the Sustainer of the worlds.",
    "3": "Allah is described as the Most Merciful, emphasizing His compassion.",
    "4": "Allah is the Master of the Day of Judgment.",
    "5": "We worship only Allah and seek His help alone.",
    "6": "A request for guidance to the straight path, the path of righteousness.",
    "7": "The path of those favored by Allah, not those who have incurred His anger or gone astray."
  }
};

module.exports = {
  name: "tafseer",
  description: "Get tafseer (explanation) for a Quran verse 📚",
  usage: "tafseer <surah_number> <ayah_number>",
  category: "islamic",
  react: "📚",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (args.length < 2) {
      return sock.sendMessage(from, { text: "❌ Usage: tafseer <surah_number> <ayah_number>" }, { quoted: msg });
    }
    const surah = args[0];
    const ayah = args[1];

    if (!tafseerSample[surah] || !tafseerSample[surah][ayah]) {
      return sock.sendMessage(from, { text: "❌ Tafseer not found for this verse." }, { quoted: msg });
    }

    const explanation = tafseerSample[surah][ayah];
    const text = `📚 Tafseer for Surah ${surah}, Ayah ${ayah}:\n\n${explanation}`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  }
};
