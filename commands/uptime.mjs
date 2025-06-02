export default {
  name: "uptime",
  description: "Muda wa bot tangu iwashwe ⏳",
  category: "tools",
  usage: "!uptime",
  async execute(sock, msg) {
    const uptime = process.uptime(); // sekunde
    const hrs = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);
    const text = `⏳ *Uptime:* ${hrs}h ${mins}m ${secs}s`;
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "⏱️", key: msg.key } });
  }
};
