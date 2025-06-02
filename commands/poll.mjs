export default {
  name: "poll",
  description: "Tengeneza kura ya maoni",
  category: "group",
  usage: "!poll Je, tupike nini leo? | Wali | Ugali | Chipsi",
  async execute(sock, msg, args) {
    const input = args.join(" ").split("|").map(x => x.trim());
    if (input.length < 3) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ Format: !poll Swali? | Chaguo1 | Chaguo2 | Chaguo3"
      }, { quoted: msg });
    }

    const [question, ...options] = input;

    await sock.sendMessage(msg.key.remoteJid, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "📊", key: msg.key } });
  }
};
