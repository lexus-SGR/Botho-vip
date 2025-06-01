export default {
  name: "userinfo",
  description: "ℹ️ Get user info / Pata taarifa za mtu",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "ℹ️", key: msg.key } });

      let userId = null;

      if (args.length) {
        // If user typed number or jid
        userId = args[0].includes("@") ? args[0] : args[0] + "@s.whatsapp.net";
      } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        userId = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        userId = msg.message.extendedTextMessage.contextInfo.participant;
      } else {
        userId = msg.key.participant || msg.key.remoteJid;
      }

      const contact = await sock.onWhatsApp(userId);

      if (!contact || !contact.length) {
        await sock.sendMessage(from, { text: "❌ User not found / Mtumiaji hayupo." });
        return;
      }

      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contact[0].notify}\nTEL;waid=${userId}:+${userId.split("@")[0]}\nEND:VCARD`;

      // Send contact card
      await sock.sendMessage(from, {
        contacts: { displayName: contact[0].notify, contacts: [{ vcard }] },
      });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Failed to get user info.\nImeshindikana kupata taarifa za mtu." });
      console.error("Userinfo command error:", error);
    }
  },
};
