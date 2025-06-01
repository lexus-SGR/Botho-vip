export default {
  name: "echo",
  description: "📢 Repeat your message / Rudisha ujumbe wako",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🔁", key: msg.key } });

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please provide a message to echo.\nTafadhali andika ujumbe wa kurudisha." });
        return;
      }

      const replyText = args.join(" ");

      if (replyText.length > 1000) {
        await sock.sendMessage(from, { text: "⚠️ Message too long! Please send a shorter message.\nUjumbe ni mrefu sana! Tuma ujumbe mfupi." });
        return;
      }

      // Simulate typing for 1 second
      await sock.sendMessage(from, { presence: { typing: true, lastSeen: false } });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sock.sendMessage(from, { text: replyText });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error occurred while echoing.\nHitilafu wakati wa kurudisha ujumbe." });
      console.error("Echo command error:", error);
    }
  },
};
