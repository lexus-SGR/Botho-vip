export default {
  name: "coinflip",
  description: "Tupa sarafu – Kichwa au Mkia",
  category: "fun",
  usage: "!coinflip",
  async execute(sock, msg) {
    const result = Math.random() < 0.5 ? "🪙 Kichwa!" : "🪙 Mkia!";
    await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: result.includes("Kichwa") ? "👍" : "👌", key: msg.key }
    });
  }
};
