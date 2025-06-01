export default {
  name: "admins",
  description: "List all admins in the group 👑",
  category: "group",
  usage: "admins",
  react: "👑",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin)
      .map(p => `@${p.id.split("@")[0]}`);

    await sock.sendMessage(
      from,
      {
        text: `👑 Group Admins:\n${admins.join("\n")}`,
        mentions: metadata.participants.map(p => p.id),
      },
      { quoted: msg }
    );
  }
};
