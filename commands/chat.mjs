export default {
  name: "chat",
  description: "💬 Chat with bot / Zungumza na bot",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "💬", key: msg.key } });

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please write something to chat.\nTafadhali andika kitu cha kuzungumza." });
        return;
      }

      const userMessage = args.join(" ");

      // Simple echo with prefix (replace this with real AI API integration)
      const reply = `You said: ${userMessage}\nUmesema: ${userMessage}`;

      await sock.sendMessage(from, { text: reply });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error chatting with bot.\nHitilafu wakati wa kuzungumza na bot." });
      console.error("Chat command error:", error);
    }
  },
};
