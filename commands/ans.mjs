export default {
  name: "ans",
  description: "Jibu swali la quiz",
  category: "fun",
  usage: "!ans B",
  async execute(sock, msg, args) {
    const userAns = args[0]?.toUpperCase();
    if (!global.currentQuiz || msg.key.remoteJid !== global.currentQuiz.id) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Hakuna quiz ya kujibu sasa." }, { quoted: msg });
    }

    if (!["A", "B", "C", "D"].includes(userAns)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Tafadhali jibu kwa A, B, C au D." }, { quoted: msg });
    }

    const correct = global.currentQuiz.answer;
    const isCorrect = userAns === correct;
    delete global.currentQuiz;

    await sock.sendMessage(msg.key.remoteJid, {
      text: isCorrect ? "🎉 Sahihi kabisa!" : `😞 Si sahihi. Jibu sahihi ni: ${correct}`
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: isCorrect ? "✅" : "❌", key: msg.key }
    });
  }
};
