const fadhilas = [
  "🕌 Kusali tahajjud hufungua mlango wa neema nyingi kutoka kwa Mwenyezi Mungu.",
  "📖 Kusoma Qur'an kila siku hufanya moyo kuwa mtulivu na kuleta baraka.",
  "🤲 Dua ya asubuhi husaidia kuanzisha siku kwa baraka na ulinzi.",
  "🕌 Kufunga Ramadhani hufanya mtu kuwa msafi kiroho na mwema kwa wengine.",
  "🛎️ Kuongeza sadaka husaidia kufungua riziki na kupunguza matatizo.",
  "🧎‍♂️ Kusujudu kwa dhati ni njia ya kukaribia Mwenyezi Mungu.",
];

export default {
  name: "fadhila",
  description: "Toa fadhila za ibada ili kuongeza msukumo 💫",
  category: "islamic",
  usage: "!fadhila",
  async execute(sock, msg) {
    const fadhila = fadhilas[Math.floor(Math.random() * fadhilas.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: fadhila }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "✨", key: msg.key } });
  }
};
