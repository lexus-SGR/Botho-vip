export default {
  name: "genimg",
  description: "Tengeneza picha kutokana na maandishi 🖌️",
  category: "ai",
  usage: "!genimg mji wa ndoto wenye miti ya dhahabu",
  async execute(sock, msg, args) {
    const prompt = args.join(" ");
    if (!prompt) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ Tafadhali andika maelezo ya picha. Mfano: `!genimg samaki anaruka juu ya mwezi`"
      }, { quoted: msg });
    }

    const imageUrl = `https://dummyimage.ai/gen?prompt=${encodeURIComponent(prompt)}`; // Bandika URL halisi ya API yako

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: imageUrl },
      caption: `🖼️ *Prompt:* ${prompt}`
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🎨", key: msg.key } });
  }
};
