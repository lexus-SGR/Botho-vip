let warnings = {};

module.exports = {
  name: "warn",
  description: "Warn a tagged user ⚠️",
  usage: "warn @user",
  category: "security",
  react: "⚠️",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    const mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!isGroup) return sock.sendMessage(from, { text: "🛑 Group only." }, { quoted: msg });
    if (!mention) return sock.sendMessage(from, { text: "🚩 Tag a user to warn." }, { quoted: msg });

    if (!warnings[from]) warnings[from] = {};
    if (!warnings[from][mention]) warnings[from][mention] = 0;
    warnings[from][mention]++;

    const count = warnings[from][mention];
    await sock.sendMessage(from, {
      text: `⚠️ @${mention.split("@")[0]} has been warned. Total warnings: *${count}*`,
      mentions: [mention]
    }, { quoted: msg });

    if (count >= 3) {
      await sock.groupParticipantsUpdate(from, [mention], "remove");
      await sock.sendMessage(from, { text: `🚫 @${mention.split("@")[0]} was removed after 3 warnings.`, mentions: [mention] });
      warnings[from][mention] = 0;
    }
  }
};
