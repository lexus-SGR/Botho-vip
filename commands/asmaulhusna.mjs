const names = [
  { name: "Ar-Rahman", meaning: "Mwingi wa Rehema", desc: "Rehema Yake ni ya wote, waumini na wasioamini." },
  { name: "Ar-Rahim", meaning: "Mwenye kurehemu", desc: "Rehema ya pekee kwa waumini." },
  { name: "Al-Malik", meaning: "Mfalme", desc: "Mmiliki wa kila kitu kilicho duniani na mbinguni." },
  { name: "Al-Quddus", meaning: "Mtakatifu", desc: "Aliyetakasika na upungufu wote." },
  { name: "As-Salam", meaning: "Mtoaji wa Amani", desc: "Anatoa amani kwa viumbe Wake." },
  { name: "Al-Mu’min", meaning: "Mwenye kutoa amani na usalama", desc: "Humthibitishia mja usalama wa kweli." },
  { name: "Al-Aziz", meaning: "Mwenye nguvu na enzi", desc: "Hakuna mwenye kumshinda." },
  { name: "Al-Hakim", meaning: "Mwenye hikma", desc: "Anatoa maamuzi kwa hekima kamili." },
  { name: "Al-Ghaffar", meaning: "Mwingi wa kusamehe", desc: "Husamehe makosa bila ukomo kwa wenye kutubu." },
  { name: "Al-Khaliq", meaning: "Muumbaji", desc: "Yeye ndiye aliyeumba kila kilicho hai na kisicho hai." },
  // Unaweza kuongeza majina mengine 89 kwa urahisi hapa
];

export default {
  name: "asmaulhusna",
  description: "Toa moja kati ya Majina 99 ya Allah (Asmaul Husna) 🕌",
  category: "islamic",
  usage: "!asmaulhusna",
  async execute(sock, msg) {
    const item = names[Math.floor(Math.random() * names.length)];
    const response = `🕌 *${item.name}* — _${item.meaning}_\n\n📖 ${item.desc}`;

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🕌", key: msg.key }
    });
  }
};
