module.exports = {
  name: "broadcast",
  description: "Send a message to all chats 📢",
  category: "admin",
  usage: "broadcast <message>",
  react: "📢",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const text = args.join(" ");
    if (!text) return sock.sendMessage(from, { text: "❌ Please enter a message to broadcast." }, { quoted: msg });

    const chats = await sock.groupFetchAllParticipating();
    for (let id in chats) {
      await sock.sendMessage(id, { text: `📢 Broadcast:\n\n${text}` });
    }

    await sock.sendMessage(from, { text: "✅ Broadcast sent to all groups." }, { quoted: msg });
  }
};
