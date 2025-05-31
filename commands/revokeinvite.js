module.exports = {
  name: "revokeinvite",
  description: "Revoke current group invite link and generate a new one 🔐",
  usage: "revokeinvite",
  category: "group",
  react: "🔐",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command only works in groups!" }, { quoted: msg });
    try {
      await sock.groupRevokeInvite(from);
      const newCode = await sock.groupInviteCode(from);
      const newLink = `https://chat.whatsapp.com/${newCode}`;
      await sock.sendMessage(from, { text: `🔐 Group invite link revoked.\nNew invite link:\n${newLink}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(from, { text: "Failed to revoke invite link. Make sure I have admin privileges." }, { quoted: msg });
    }
  }
};
