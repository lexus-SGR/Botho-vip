module.exports = {
  name: "grouplock",
  description: "Lock/unlock group to allow only admins to send messages 🔒",
  usage: "grouplock on / off",
  category: "security",
  react: "🔐",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "👥 Only in group." }, { quoted: msg });
    const choice = args[0]?.toLowerCase();
    if (!["on", "off"].includes(choice)) return sock.sendMessage(from, { text: "🛠️ Use `.grouplock on/off`." }, { quoted: msg });

    const setting = choice === "on" ? "announcement" : "not_announcement";
    await sock.groupSettingUpdate(from, setting);
    await sock.sendMessage(from, { text: `🔐 Group messaging has been *${choice === "on" ? "LOCKED" : "UNLOCKED"}*.` }, { quoted: msg });
  }
};
