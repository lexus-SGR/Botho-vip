export default {
  name: "hidetag",
  description: "Tuma ujumbe kwa group bila kuonyesha majina yao (silent tag)",
  category: "group",
  usage: "😁hidetag Hello group!",
  async execute(sock, msg, args, from, isGroup) {
    try {
      if (!isGroup) {
        return await sock.sendMessage(from, {
          text: "⚠️ Hii amri inapatikana tu kwenye magroup.",
        }, { quoted: msg });
      }

      // Pata taarifa za group na members
      const groupMetadata = await sock.groupMetadata(from);
      const members = groupMetadata.participants.map(p => p.id);

      // Pata ujumbe kutoka kwa args, au tumia default
      const message = args.length ? args.join(" ") : "📢 Hello everyone!";

      // Tuma ujumbe na mentions kwa members wote
      await sock.sendMessage(from, {
        text: message,
        mentions: members,
      }, { quoted: msg });

      // React kwa emoji ya 👻 kama confirmation
      await sock.sendMessage(from, {
        react: { text: "🎤", key: msg.key }
      });

    } catch (err) {
      console.error("Hidetag error:", err);
      await sock.sendMessage(from, { text: "❌ Hitilafu wakati wa kutuma silent tag." }, { quoted: msg });
    }
  }
};
