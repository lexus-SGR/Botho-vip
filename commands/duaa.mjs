const duas = [
  {
    title: "Dua ya Asubuhi",
    arabic: "اللّهُمَّ أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    meaning: "Ee Allah, tumeamka, na milki yote ni Yako.",
  },
  {
    title: "Dua kabla ya kula",
    arabic: "بِسْمِ اللَّهِ",
    meaning: "Kwa jina la Allah.",
  },
  {
    title: "Dua baada ya kula",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا",
    meaning: "Sifa zote ni za Allah aliyeturuzuku chakula na maji.",
  },
  {
    title: "Dua ya kuingia msikitini",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    meaning: "Ee Allah nifungulie milango ya rehema zako.",
  },
  {
    title: "Dua ya kutoka nyumbani",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ",
    meaning: "Kwa jina la Allah, ninamtegemea Yeye.",
  },
  {
    title: "Dua ya kulala",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    meaning: "Kwa jina lako Ee Allah, ninakufa na kuishi.",
  }
];

export default {
  name: "duaa",
  description: "Toa dua ya kila siku kwa Kiislamu 🤲",
  category: "islamic",
  usage: "!duaa",
  async execute(sock, msg) {
    const dua = duas[Math.floor(Math.random() * duas.length)];

    const response = `🤲 *${dua.title}*\n\n📜 ${dua.arabic}\n\n💬 _${dua.meaning}_`;

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🤲", key: msg.key }
    });
  }
};
