const quizzes = [
  {
    question: "🧠 Nchi gani ina watu wengi zaidi duniani?",
    options: ["A. Marekani", "B. India", "C. China", "D. Brazil"],
    answer: "C"
  },
  {
    question: "🌋 Mlima mrefu zaidi Afrika ni?",
    options: ["A. Kenya", "B. Meru", "C. Kilimanjaro", "D. Elgon"],
    answer: "C"
  }
];

export default {
  name: "quiz",
  description: "Toa swali la kuchangamsha ubongo",
  category: "fun",
  usage: "!quiz",
  async execute(sock, msg) {
    const q = quizzes[Math.floor(Math.random() * quizzes.length)];
    const text = `${q.question}\n\n${q.options.join("\n")}\n\n⚠️ Jibu kwa: !ans [A/B/C/D]`;
    global.currentQuiz = { id: msg.key.remoteJid, answer: q.answer };

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "❓", key: msg.key } });
  }
};
