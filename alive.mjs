import figlet from "figlet";

export default {
  name: "alive",
  description: "💡 Check if bot is alive / Angalia kama bot iko hai",
  async execute(sock, msg, args, from) {
    try {
      // Reaction on receiving command
      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

      // Generate figlet text art asynchronously with Promise wrapper
      const figletText = await new Promise((resolve, reject) => {
        figlet.text("BOT ALIVE", { font: "Ghost" }, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      // Compose multi-line bilingual message with uptime info
      const uptimeSeconds = process.uptime();
      const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

      const text = `
\`\`\`${figletText}\`\`\`
🟢 I’m online and ready!  
⏱️ Uptime: ${uptime} (HH:mm:ss)  
Type *!help* to see available commands.

🟢 Niko mtandaoni na tayari!  
⏱️ Saa tangu nianze: ${uptime}  
Andika *!help* kuona orodha ya commands.
      `;

      await sock.sendMessage(from, { text });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error occurred while checking status.\nHitilafu imetokea." });
      console.error("Alive command error:", error);
    }
  },
};
