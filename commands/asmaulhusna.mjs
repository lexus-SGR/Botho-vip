const names = [
  { name: "Ar-Rahman", meaning: "Mwingi wa Rehema", desc: "Rehema Yake ni kwa wote." },
  { name: "Ar-Rahim", meaning: "Mwenye kurehemu", desc: "Huwaonea huruma waumini." },
  { name: "Al-Malik", meaning: "Mfalme", desc: "Mmiliki wa kila kitu." },
  { name: "Al-Quddus", meaning: "Mtakatifu", desc: "Aliye mbali na kila upungufu." },
  { name: "As-Salam", meaning: "Mtoaji wa amani", desc: "Mwenye kutuliza roho." },
  { name: "Al-Mu’min", meaning: "Mwenye kutoa usalama", desc: "Huhakikishia waumini usalama." },
  { name: "Al-Aziz", meaning: "Mwenye enzi", desc: "Hakuna anayemshinda." },
  { name: "Al-Hakim", meaning: "Mwenye hekima", desc: "Maamuzi yake ni yenye hekima." },
  { name: "Al-Ghaffar", meaning: "Mwingi wa kusamehe", desc: "Husamehe makosa ya wenye kutubu." },
  { name: "Al-Khaliq", meaning: "Muumbaji", desc: "Aliumba kila kilicho hai." },
  { name: "Al-Bari", meaning: "Muumba pasipo mfano", desc: "Huumba kwa ukamilifu." },
  { name: "Al-Musawwir", meaning: "Mfinyanzi", desc: "Hupa kila kiumbe sura na umbo." },
  { name: "Al-‘Aleem", meaning: "Mjuzi", desc: "Anajua yote yaliyo wazi na yaliyofichwa." },
  { name: "Al-Khabir", meaning: "Mwenye habari", desc: "Anafahamu undani wa mambo." },
  { name: "As-Sami’", meaning: "Msikivu", desc: "Husikia kila kilicho semwa." },
];

export default {
  name: "asmaulhusna",
  description: "Onesha moja ya Majina 99 ya Allah (Asmaul Husna) 🕌",
  category: "islamic",
  usage: "📿 !asmaulhusna",
  async execute(sock, msg) {
    const item = names[Math.floor(Math.random() * names.length)];
    const response = `🕌 *${item.name}* — _${item.meaning}_\n\n📖 ${item.desc}`;

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🕌", key: msg.key }
    });
  }
};
