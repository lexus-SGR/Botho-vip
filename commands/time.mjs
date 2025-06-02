export default {
  name: "time",
  description: "Onyesha saa na tarehe ya sasa",
  category: "tools",
  usage: "!time",
  async execute(sock, msg) {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const message = `📅 *Leo ni:* ${date}\n⏰ *Saa:* ${time}`;

    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });
  }
};
