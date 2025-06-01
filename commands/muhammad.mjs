export default {
  name: "muhammad",
  description: "Toa maelezo ya maisha na mafanikio ya Mtume Muhammad (SAW)",
  category: "islamic",
  usage: "!muhammad",
  async execute(sock, msg) {
    const message = `
☪️ *Mtume Muhammad (SAW) - Mjumbe wa Mwenyezi Mungu*

- Alizaliwa Makkah mwaka 570 BK, na alitawaliwa na huruma na haki.
- Alipokea wahyi ya Qur'an kupitia Malaika Jibril akiwa na miaka 40.
- Alihubiri Uislamu wa haki, amani, na ibada safi.
- Alipambana dhidi ya makafiri na kufanikisha kueneza Uislamu ulimwenguni.
- Alifariki mwaka 632 BK, lakini mafundisho yake yanaishi milele.

*Hadithi fupi:*
Mtume Muhammad (SAW) alisema, "Mwenye huruma hupata rehema kutoka kwa Mwenyezi Mungu."

Mfuate njia yake ya haki na upendo.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
