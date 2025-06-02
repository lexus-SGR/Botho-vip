const emojis = ["😂", "🤔", "😎", "😇", "👻", "💀", "🐶", "🐱", "🦄", "🍕", "🚀", "🎉"];

export default {
  name: "emoji",
  description: "🎲 Tuma mchanganyiko wa emojis wa bahati nasibu",
  category: "fun",
  async execute(sock, msg, args, from) {
    try {
      const mix = Array.from({ length: 10 }, () => emojis[Math.floor(Math.random() * emojis.length)]).join(" ");
      await sock.sendMessage(from, { text: `🎰 Emoji Mix:\n${mix}` }, { quoted: msg });

      // Emoji reaction
      await sock.sendMessage(from, {
        react: { text: "🎲", key: msg.key }
      });
    } catch (error) {
      console.error("❌ Emoji command error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kutuma emojis."
      }, { quoted: msg });
    }
  }
};
