module.exports = {
  name: "clearall",
  description: "Delete all chats (DANGEROUS) 🧹",
  category: "admin",
  usage: "clearall",
  react: "🧹",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const chats = await sock.chats.all();
    for (const id of Object.keys(chats)) {
      await sock.chatModify({ clear: { messages: [{ id }] } }, id);
    }
    await sock.sendMessage(from, { text: "🧹 All chats cleared!" }, { quoted: msg });
  }
};
