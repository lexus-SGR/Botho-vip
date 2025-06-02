import fetch from "node-fetch";

export default {
  name: "fact",
  description: "🧠 Pata fun fact ya kuvutia",
  async execute(sock, msg, args, from) {
    try {
      const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      const data = await res.json();

      if (!data || !data.text) {
        return await sock.sendMessage(from, {
          text: "❌ Samahani, siwezi kupata fact kwa sasa."
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `💡 *Fun Fact:*\n${data.text}`
      }, { quoted: msg });

      // React na 🧠
      await sock.sendMessage(from, {
        react: { text: "🧠", key: msg.key }
      });

    } catch (error) {
      console.error("❌ Fact command error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kupata fun fact."
      }, { quoted: msg });
    }
  }
};
