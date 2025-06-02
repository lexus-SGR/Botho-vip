export default {
  name: "😁poststatus",
  description: "Weka status yako ya WhatsApp 📝",
  category: "status",
  usage: "!poststatus Hello friends!",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Andika status yako. Mfano: !poststatus Hello friends!" }, { quoted: msg });

    const text = args.join(" ");
    await sock.sendPresenceUpdate("composing", msg.key.remoteJid);
    await sock.sendMessage("status@broadcast", { text });

    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ Status yako imewekwa: " + text,
    }, { quoted: msg });
  }
};
