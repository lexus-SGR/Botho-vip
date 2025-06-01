export default {
  name: "hidetag",
  description: "Tuma ujumbe kwa group bila kuonyesha majina yao (silent tag)",
  category: "group",
  usage: "😁hidetag Hello group!",
  async execute(sock, msg) {
    const { key, body, from, isGroup } = msg;

    if (!isGroup) {
      return await sock.sendMessage(from, {
        text: "⚠️ Hii amri inapatikana tu kwenye magroup.",
      }, { quoted: msg });
    }

    const groupMetadata = await sock.groupMetadata(from);
    const members = groupMetadata.participants.map(p => p.id);

    const message = body.split(' ').slice(1).join(' ') || "📢 Hello everyone!";
    
    await sock.sendMessage(from, {
      text: message,
      mentions: members,
    }, { quoted: msg });

    await sock.sendMessage(from, {
      react: { text: "👻", key }
    });
  }
};
