module.exports = {
  name: "speed",
  description: "Check bot response speed ⚡",
  usage: "speed",
  category: "info",
  react: "⚡",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const start = Date.now();
    await sock.sendPresenceUpdate("composing", from);
    const end = Date.now();
    const latency = end - start;
    await sock.sendMessage(from, { text: `⚡ *Bot Speed:*\nResponse time is ${latency} ms.` }, { quoted: msg });
  }
};
