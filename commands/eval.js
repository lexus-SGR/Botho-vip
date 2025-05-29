module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code 💻",
  category: "owner",
  usage: "eval <code>",
  react: "💻",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    try {
      const code = args.join(" ");
      let evaled = await eval(code);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      await sock.sendMessage(from, { text: `🧠 Eval Result:\n\n${evaled}` }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(from, { text: `❌ Eval Error:\n\n${err}` }, { quoted: msg });
    }
  }
};
