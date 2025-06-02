const facts = [
  "🧠 Moyo wa samaki mdogo huitwa kwenye kichwa chake!",
  "🌍 Antaktika ndiyo jangwa kubwa zaidi duniani – kwa sababu haina mvua!",
  "🧬 DNA ya binadamu na ndizi ni 60% kufanana!",
  "🐙 Pweza ana akili katika mikono yake yote minane!"
];

export default {
  name: "fakta",
  description: "Toa fakta ya ajabu na ya kushangaza",
  category: "fun",
  usage: "!fakta",
  async execute(sock, msg) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: fact }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🤯", key: msg.key }
    });
  }
};
