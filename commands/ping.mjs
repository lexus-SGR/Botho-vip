export default {
  name: "ping",
  description: "🏓 Check bot latency / Angalia latency ya bot",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🏓", key: msg.key } });

      // Start timer
      const start = Date.now();

      // Send initial message and wait for ack
      await sock.sendMessage(from, { text: "Ping... 🏓" });

      const latency = Date.now() - start;
      const reply = `Pong! Bot is working well 🟢\nLatency: ${latency}ms\n\nPong! Bot inafanya kazi vizuri 🟢\nLatency: ${latency}ms`;

      await sock.sendMessage(from, { text: reply });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error occurred during ping.\nHitilafu wakati wa ping." });
      console.error("Ping command error:", error);
    }
  },
};
