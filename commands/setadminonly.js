let adminOnly = false;

module.exports = {
  name: "setadminonly",
  description: "Allow only admins to use bot commands ⚠️",
  category: "security",
  usage: "setadminonly on/off",
  react: "⚠️",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const option = args[0];
    if (option === "on") {
      adminOnly = true;
      await sock.sendMessage(from, { text: "🛡️ Admin-only mode *enabled*" }, { quoted: msg });
    } else if (option === "off") {
      adminOnly = false;
      await sock.sendMessage(from, { text: "🔓 Admin-only mode *disabled*" }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: "Usage: setadminonly on/off" }, { quoted: msg });
    }
  }
};
