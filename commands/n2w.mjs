import toWords from "number-to-words";

export default {
  name: "n2w",
  description: "Badilisha namba kuwa maneno 🔢",
  category: "tools",
  usage: "!n2w 245",
  async execute(sock, msg, args) {
    const num = parseInt(args[0]);
    if (isNaN(num)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Tafadhali weka namba sahihi. Mf: `!n2w 999`" }, { quoted: msg });
    }

    const words = toWords.toWords(num);
    await sock.sendMessage(msg.key.remoteJid, { text: `🧮 *${num}* kwa maandishi ni: _${words}_` }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🔢", key: msg.key } });
  }
};
