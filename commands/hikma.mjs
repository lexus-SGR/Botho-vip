const wisdoms = [
  {
    title: "Subira",
    message: "⏳ Subira ni ufunguo wa faraja. Mambo mazuri huchukua muda.",
  },
  {
    title: "Kujitambua",
    message: "🔍 Mtu anayejitambua hawezi kupotoshwa kirahisi. Jifahamu, ujithamini.",
  },
  {
    title: "Kujifunza kimya",
    message: "🤫 Kimya ni hekima, si kila jambo linahitaji jibu. Sikiliza zaidi, sema kidogo.",
  },
  {
    title: "Matendo mema",
    message: "✨ Kila tendo jema ni sadaka. Tabasamu lako kwa mwingine ni thawabu.",
  },
  {
    title: "Kusamehe",
    message: "💞 Msamaha si kwa ajili yao — ni kwa ajili ya amani yako mwenyewe.",
  },
  {
    title: "Tawakkul",
    message: "🕊️ Mtegemee Allah baada ya juhudi zako. Riziki yako haicheleweshwi.",
  }
];

export default {
  name: "hikma",
  description: "Toa hekima ya maisha ya kila siku 🧠",
  category: "inspiration",
  usage: "!hikma",
  async execute(sock, msg) {
    const wisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

    const response = `🧠 *${wisdom.title}*\n\n${wisdom.message}`;

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "📘", key: msg.key }
    });
  }
};
