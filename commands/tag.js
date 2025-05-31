module.exports = {
  name: "tagall",
  description: "Tag all members in the group 📢",
  usage: "tagall",
  category: "group",
  react: "📢",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command only works in groups!" }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);

    const text = `📢 Attention everyone!\n\n${args.length ? args.join(" ") : ""}`;

    await sock.sendMessage(from, { text, mentions: participants }, { quoted: msg });
  }
};
