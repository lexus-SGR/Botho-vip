export default {
  name: "hidetag",
  description: "Tuma ujumbe kwa wote wa group bila kutaja majina (hidden tag)",
  category: "group",
  usage: "!hidetag <message>",
  async execute(sock, msg) {
    const { from, isGroup, sender, body, key } = msg;
    if (!isGroup) {
      return await sock.sendMessage(from, { text: "Command hii ni kwa group tu." }, { quoted: msg });
    }
    const message = body.slice(8).trim();
    if (!message) {
      return await sock.sendMessage(from, { text: "Tafadhali andika ujumbe baada ya !hidetag" }, { quoted: msg });
    }
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants.map(p => p.id);
    await sock.sendMessage(from, { text: message, mentions: participants }, { quoted: msg });

    // react with emoji 🎤
    await sock.sendMessage(from, { react: { text: "🎤", key } });
  }
};
