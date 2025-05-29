module.exports = {
  name: "ping",
  description: "Check if the bot is alive - sudo only ✨",
  category: "utility",
  react: "🏓",
  usage: "ping",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const mention = sender ? `@${sender.split("@")[0]}` : "@user";
    const replyText = `✨ Hey ${mention}! Pong! 🏓 Your bot is alive and sparklin'!`;

    // Check if msg exists and has key before quoting
    if (msg && msg.key) {
      await sock.sendMessage(from, { text: replyText, mentions: [sender] }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: replyText, mentions: [sender] });
    }
  }
};
