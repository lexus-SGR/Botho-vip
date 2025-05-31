module.exports = {
  name: "remove",
  description: "Remove (kick) a member from the group 🔥 (sudo only)",
  category: "admin",
  react: "👢",
  usage: "remove @user or reply to user's message",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    try {
      if (!msg.key.remoteJid.endsWith("@g.us")) {
        return await sock.sendMessage(from, { text: "This command works only in groups!" }, { quoted: msg });
      }

      const isSudo = sender === "255654478605@s.whatsapp.net"; // badilisha hapa na namba yako
      if (!isSudo) {
        return await sock.sendMessage(from, { text: "You have no permission to use this command!" }, { quoted: msg });
      }

      // Jaribu kupata user aliyetagwa
      let userToRemove = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      // Kama hajatag, jaribu pata user aliyereplywa
      if (!userToRemove) {
        userToRemove = msg.message?.extendedTextMessage?.contextInfo?.participant;
      }

      if (!userToRemove) {
        return await sock.sendMessage(from, { text: "Please mention or reply to the user you want to remove!" }, { quoted: msg });
      }

      await sock.groupParticipantsUpdate(from, [userToRemove], "remove");

      const gifUrl = "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif";

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
