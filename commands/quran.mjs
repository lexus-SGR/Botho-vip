const verses = [
  {
    surah: "Al-Fatiha",
    ayah: "1",
    text: "Bismillahir Rahmanir Rahim",
    translation: "Kwa jina la Mwenyezi Mungu, Mwingi wa rehema, Mwenye kurehemu."
  },
  {
    surah: "Al-Baqara",
    ayah: "2",
    text: "Dhalika al-kitabu la rayba fihi, hudan lil muttaqin",
    translation: "Hiki ni Kitabu kisicho na shaka ndani yake, ni uongozi kwa wachamungu."
  },
  {
    surah: "Al-Imran",
    ayah: "185",
    text: "Kullu nafsin dha'iqatul mawt",
    translation: "Kila nafsi itaonja mauti."
  },
  {
    surah: "An-Nisa",
    ayah: "36",
    text: "Wa'budullaha wala tushriku bihi shay'a",
    translation: "Muabuduni Mwenyezi Mungu wala msimshirikishe na chochote."
  },
  {
    surah: "Al-Ma'idah",
    ayah: "8",
    text: "I’dilu huwa aqrabu lit-taqwa",
    translation: "Fanyeni uadilifu, hiyo ndiyo karibu na uchamungu."
  },
  {
    surah: "Al-An'am",
    ayah: "141",
    text: "Innahu la yuhibbul musrifeen",
    translation: "Hakika Yeye hapendi wanaopita mipaka."
  },
  {
    surah: "Al-A'raf",
    ayah: "31",
    text: "Kulu washrabu wala tusrifu",
    translation: "Kuleni na kunyweni, lakini msifanye israfu."
  },
  {
    surah: "Al-Anfal",
    ayah: "2",
    text: "Innamal mu’minunalladhina idha dhukirallahu wajilat qulubuhum",
    translation: "Waumini wa kweli ni wale ambao nyoyo zao hutetemeka anapotajwa Mwenyezi Mungu."
  },
  {
    surah: "At-Tawbah",
    ayah: "51",
    text: "Qul lan yusibana illa ma kataballahu lana",
    translation: "Sema: Hakika sisi hatutapatwa na chochote ila yale aliyotuandikia Mwenyezi Mungu."
  },
  {
    surah: "Yunus",
    ayah: "61",
    text: "Wama tasqutu min waraqatin illa ya’lamuha",
    translation: "Wala haianguki jani lolote ila Yeye analijua."
  },
  {
    surah: "Hud",
    ayah: "115",
    text: "Innal hasanati yudhhibnas sayyi’at",
    translation: "Hakika mema huondoa maovu."
  },
  {
    surah: "Yusuf",
    ayah: "90",
    text: "Innahu man yattaqi wa yasbir fa innallaha la yudhi'u ajral muhsineen",
    translation: "Hakika mwenye kumcha Mungu na kuvumilia, basi Mwenyezi Mungu hapotezi thawabu za watenda mema."
  },
  {
    surah: "Ar-Ra'd",
    ayah: "11",
    text: "Inna Allaha la yughayyiru ma bi qawmin hatta yughayyiru ma bi anfusihim",
    translation: "Hakika Mwenyezi Mungu habadili hali ya watu mpaka wabadilike wao wenyewe."
  },
  {
    surah: "Ibrahim",
    ayah: "7",
    text: "La'in shakartum la'azidannakum",
    translation: "Kama mtashukuru, hakika nitakuzidishieni."
  },
  {
    surah: "Al-Hijr",
    ayah: "9",
    text: "Inna nahnu nazzalna dh-dhikra wa inna lahu la hafizun",
    translation: "Hakika Sisi tumeiteremsha Qur'an na hakika Sisi tutaulinda."
  }
];

export default {
  name: "quran",
  description: "Toa aya ya Qur'an 📖",
  category: "islamic",
  usage: "!quran",
  async execute(sock, msg) {
    const aya = verses[Math.floor(Math.random() * verses.length)];
    const response = `📖 *${aya.surah}* - Ayah ${aya.ayah}\n\n🕋 ${aya.text}\n\n🔸 ${aya.translation}`;

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "📖", key: msg.key }
    });
  }
};
