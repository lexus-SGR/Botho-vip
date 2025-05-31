let enableNSFWBlock = {}; // store enabled groups here

module.exports = {
  name: "nsfwblock",
  description: "Enable or disable NSFW sticker/video blocking in group",
  usage: "nsfwblock on/off",
  category: "security",
  react: "🚫",
  sudo: true, // owner only
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "This command only works in groups." }, { quoted: msg });

    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      return await sock.sendMessage(from, { text: "Usage: nsfwblock on/off" }, { quoted: msg });
    }

    if (args[0].toLowerCase() === "on") {
      enableNSFWBlock[from] = true;
      await sock.sendMessage(from, { text: "🚫 NSFW blocker enabled for this group." }, { quoted: msg });
    } else {
      enableNSFWBlock[from] = false;
      await sock.sendMessage(from, { text: "✅ NSFW blocker disabled for this group." }, { quoted: msg });
    }
  }
};

module.exports.enableNSFWBlock = enableNSFWBlock; // export to use in main handler
