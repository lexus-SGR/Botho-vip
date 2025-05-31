const quran = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "Indeed, with hardship comes ease. (Surah Ash-Sharh 94:6)"
  },
  {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    english: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence. (Surah Al-Baqarah 2:255)"
  }
];
const verse = quran[Math.floor(Math.random() * quran.length)];
await sock.sendMessage(from, { text: `${verse.arabic}\n\n${verse.english}` }, { quoted: msg });
