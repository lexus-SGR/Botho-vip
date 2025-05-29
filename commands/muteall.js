module.exports = {
  name: "muteall",
  description: "Mute all participants in a group 📴",
  usage: "muteall",
  category: "security",
  react: "🔇",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "📵 Group use only." }, { quoted: msg });
    await sock.groupSettingUpdate(from, "announcement");
    await sock.sendMessage(from, { text: "🔇 Group has been muted for all participants." }, { quoted: msg });
  }
};
