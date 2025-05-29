module.exports = {
  name: "hello",
  description: "Greet the bot 👋",
  usage: "hello",
  category: "fun",
  react: "👋",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    await sock.sendMessage(from, { text: "👋 Hello! I'm your friendly WhatsApp bot. How can I help you today?" }, { quoted: msg });
  }
};
