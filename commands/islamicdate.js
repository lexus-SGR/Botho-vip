module.exports = {
  name: "islamicdate",
  description: "Get today's Islamic (Hijri) date 📅",
  category: "islamic",
  usage: "!islamicdate",
  react: "📅",
  async execute(sock, msg, args, from) {
    const hijriDate = `21 Dhul Qadah 1446 AH (example)`; // You can replace this with real Hijri API if needed
    await sock.sendMessage(from, {
      text: `📅 *Islamic Date Today*\n\n🕋 ${hijriDate}`
    }, { quoted: msg });
  }
};
