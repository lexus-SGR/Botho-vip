module.exports = {
  name: "surah",
  description: "Get Surah details and audio 🎧",
  usage: "!surah Al-Fatiha",
  category: "islamic",
  react: "📖",
  async execute(sock, msg, args, from) {
    const surahName = args.join(" ");
    if (!surahName) return sock.sendMessage(from, { text: "Please provide a Surah name, e.g., !surah Al-Fatiha" }, { quoted: msg });

    // Simple hardcoded example
    if (surahName.toLowerCase() === "al-fatiha") {
      return sock.sendMessage(from, {
        text: `📖 *Surah Al-Fatiha*\nVerses: 7\nRevelation: Makkah\nAudio: https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/001.mp3`
      }, { quoted: msg });
    }

    return sock.sendMessage(from, { text: `❌ Surah not found in local database.` }, { quoted: msg });
  }
};
