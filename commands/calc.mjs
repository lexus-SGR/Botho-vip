export default {
  name: "😁calc",
  description: "Fanya hesabu rahisi (+, -, *, /) 🧮",
  category: "tools",
  usage: "!calc 5 * 3",
  async execute(sock, msg, args) {
    try {
      if (args.length < 3) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Tumia mfano: !calc 5 * 3" }, { quoted: msg });
      }

      const expression = args.join(" ");
      // Very basic safety: only allow digits and operators
      if (!/^[0-9+\-*/ ().]+$/.test(expression)) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hesabu haikubali herufi zisizo halali." }, { quoted: msg });
      }

      const result = eval(expression);
      await sock.sendMessage(msg.key.remoteJid, { text: `🧮 Result: ${result}` }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kufanya hesabu." });
    }
  }
};
