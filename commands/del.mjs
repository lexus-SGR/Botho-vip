export default {
  name: "del",
  description: "Futa meseji unayo-quote (admin only)",
  category: "admin",
  usage: "!del",
  async execute(sock, msg) {
    if (!msg.isGroup) {
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Amri hii inapatikana kwenye group tu." }, { quoted: msg });
    }

    if (!msg.quoted) {
      return sock.sendMessage(msg.key.remoteJid, { text: "🗑️ Tafadhali quote meseji unayotaka kufuta." }, { quoted: msg });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      delete: {
        remoteJid: msg.key.remoteJid,
        fromMe: false,
        id: msg.quoted.key.id,
        participant: msg.quoted.key.participant
      }
    });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🧹", key: msg.key } });
  }
};
