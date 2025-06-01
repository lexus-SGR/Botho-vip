// commands/emoji.mjs
const emojis = ["😂", "🤔", "😎", "😇", "👻", "💀", "🐶", "🐱", "🦄", "🍕", "🚀", "🎉"];

export default {
  name: "😁emoji",
  description: "Send random emojis 🎲",
  category: "fun",
  async execute(sock, msg) {
    const mix = Array.from({ length: 10 }, () => emojis[Math.floor(Math.random() * emojis.length)]).join(" ");
    await sock.sendMessage(msg.key.remoteJid, { text: `🎰 Emoji Mix:\n${mix}` }, { quoted: msg });
  }
};
