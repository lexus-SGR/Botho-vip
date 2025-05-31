module.exports = {
  name: "setmessaging",
  description: "Set who can send messages in the group (admins/members) 📢",
  usage: "setmessaging <admins|all>",
  category: "group",
  react: "📢",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command only works in groups!" }, { quoted: msg });
    if (args.length === 0) return await sock.sendMessage(from, { text: "Please specify 'admins' or 'all'." }, { quoted: msg });

    const setting = args[0].toLowerCase();
    if (!["admins", "all"].includes(setting)) {
      return await sock.sendMessage(from, { text: "Invalid option! Use 'admins' or 'all'." }, { quoted: msg });
    }

    try {
      await sock.groupSettingUpdate(from, setting === "admins" ? "announcement" : "not_announcement");
      await sock.sendMessage(from, { text: `Group messaging permission updated: Only ${setting} can send messages.` });
    } catch {
      await sock.sendMessage(from, { text: "Failed to update messaging permissions. Make sure I have admin privileges." }, { quoted: msg });
    }
  }
};
