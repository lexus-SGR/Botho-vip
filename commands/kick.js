module.exports = {
  name: "kick",
  description: "Remove a member from the group 👢",
  usage: "kick @user (or reply to their message)",
  category: "admin",
  react: "👢",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup, groupMetadata) {
    if (!isGroup) {
      return sock.sendMessage(from, { text: "👥 This command can only be used in groups." }, { quoted: msg });
    }

    let userToKick;

    // Case 1: If user is mentioned
    if (msg.mentionedJid && msg.mentionedJid.length > 0) {
      userToKick = msg.mentionedJid[0];
    }

    // Case 2: If user replied to someone's message
    else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      userToKick = msg.message.extendedTextMessage.contextInfo.participant;
    }

    // Case 3: No target found
    else {
      return sock.sendMessage(from, { text: "⚠️ Please mention or reply to the user you want to remove." }, { quoted: msg });
    }

    // Prevent bot or sender from being removed
    if ([sender, sock.user.id].includes(userToKick)) {
      return sock.sendMessage(from, { text: "🚫 You can't remove yourself or the bot." }, { quoted: msg });
    }

    // Kick the user
    await sock.groupParticipantsUpdate(from, [userToKick], "remove");
    await sock.sendMessage(from, {
      text: `👢 Removed @${userToKick.split("@")[0]} from the group.`,
      mentions: [userToKick]
    }, { quoted: msg });
  }
};
