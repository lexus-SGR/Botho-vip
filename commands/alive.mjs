import figlet from "figlet";

export default {
  name: "alive",
  description: "💡 Angalia kama bot iko hai",
  async execute(sock, msg, args, from) {
    await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    figlet.text("BOT ALIVE", { font: "Ghost" }, async (err, data) => {
      const text = `
\`\`\`${data}\`\`\`
🟢 I’m online and ready! Type *!help* to see available commands.
`;
      await sock.sendMessage(from, { text });
    });
  },
};
