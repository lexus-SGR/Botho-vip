module.exports = {
  name: "remove",
  description: "Remove (kick) a member from the group 🔥 (sudo only)",
  category: "admin",
  react: "👢",
  usage: "remove @user",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    try {
      // Check if in group
      if (!msg.key.remoteJid.endsWith("@g.us")) {
        return await sock.sendMessage(from, { text: "This command works only in groups!" }, { quoted: msg });
      }

      // Check if sender is sudo
      const isSudo = sender === "255654478605@s.whatsapp.net"; // change to your owner number with @s.whatsapp.net
      if (!isSudo) {
        return await sock.sendMessage(from, { text: "You have no responsibility to use this command!" }, { quoted: msg });
      }

      // Get mentioned users or argument
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentioned.length === 0) {
        return await sock.sendMessage(from, { text: "Please mention the user to remove!" }, { quoted: msg });
      }

      const userToRemove = mentioned[0];

      // Kick the user from the group
      await sock.groupParticipantsUpdate(from, [userToRemove], "remove");

      // Send gif reaction on success
      const gifUrl = "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif"; // kick gif example

      await sock.sendMessage(from, { 
        video: { url: gifUrl },
        gifPlayback: true,
        caption: `User @${userToRemove.split("@")[0]} has been removed from the group! 👢`,
        mentions: [userToRemove]
      });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "Failed to remove the user." }, { quoted: msg });
    }
  }
};
