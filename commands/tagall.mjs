export default {
  name: "tagall",
  description: "Mtaja kila mtu katika group (public tagging)",
  category: "group",
  usage: "!tagall <message>",
  async execute(sock, msg) {
    const { from, isGroup, sender, body, key } = msg;
    if (!isGroup) {
      return await sock.sendMessage(from, { text: "Command hii ni kwa group tu." }, { quoted: msg });
    }
    const message = body.slice(7).trim();
    if (!message) {
      return await sock.sendMessage(from, { text: "Tafadhali andika ujumbe baada ya !tagall" }, { quoted: msg });
    }
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants.map(p => p.id);
    const mentionText = participants.map(u => `@${u.split("@")[0]}`).join(' ');
    const text = `${message}\n\n${mentionText}`;
    await sock.sendMessage(from, { text, mentions: participants }, { quoted: msg });

    // react with emoji 🎉
    await sock.sendMessage(from, { react: { text: "🎉", key } });
  }
};
