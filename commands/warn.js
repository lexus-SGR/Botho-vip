let warnings = {};

module.exports = {
  name: "warn",
  description: "Warn a user by reply or tag ⚠️",
  usage: "warn @user or reply to user message with warn",
  category: "security",
  react: "⚠️",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "🛑 This command is for groups only." }, { quoted: msg });

    // Jaribu kupata mentionedJid kama ametag
    let mention = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // Kama hakuna tag, jaribu pata user aliyependekezwa kwa reply
    if (!mention) {
      mention = msg.message.extendedTextMessage?.contextInfo?.participant;
    }

    if (!mention) {
      return sock.sendMessage(from, { text: "🚩 Please tag or reply to a user to warn." }, { quoted: msg });
    }

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
