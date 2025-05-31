module.exports = {
  name: "setsettings",
  description: "Set group settings: who can edit group info (admins/members) ⚙️",
  usage: "setsettings <admins|all>",
  category: "group",
  react: "⚙️",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command only works in groups!" }, { quoted: msg });
    if (args.length === 0) return await sock.sendMessage(from, { text: "Please specify 'admins' or 'all'." }, { quoted: msg });

    const setting = args[0].toLowerCase();
    if (!["admins", "all"].includes(setting)) {
      return await sock.sendMessage(from, { text: "Invalid option! Use 'admins' or 'all'." }, { quoted: msg });
    }

    try {
      await sock.groupSettingUpdate(from, setting === "admins" ? "locked" : "unlocked");
      await sock.sendMessage(from, { text: `Group setting updated: Only ${setting} can change group info.` });
    } catch {
      await sock.sendMessage(from, { text: "Failed to update group settings. Make sure I have admin privileges." }, { quoted: msg });
    }
  }
};
