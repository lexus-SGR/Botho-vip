let antifake = {};

module.exports = {
  name: "antifake",
  description: "Kick non-TZ numbers from group 🇹🇿",
  usage: "antifake on / off",
  category: "security",
  react: "🛑",
  sudo: true,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!isGroup) return sock.sendMessage(from, { text: "👥 Group only command." }, { quoted: msg });
    const choice = args[0]?.toLowerCase();
    if (!["on", "off"].includes(choice)) return sock.sendMessage(from, { text: "❓ Use `.antifake on` or `.antifake off`" }, { quoted: msg });

    antifake[from] = choice === "on";
    await sock.sendMessage(from, { text: `✅ Anti-fake is now *${choice.toUpperCase()}*.` }, { quoted: msg });
  }
};

// on new participant join
if (antifake[from]) {
  for (const user of msg.messageStubParameters) {
    if (!user.startsWith("255")) {
      await sock.sendMessage(from, { text: `🚷 @${user.split("@")[0]} removed (Not a Tanzanian number).`, mentions: [user] });
      await sock.groupParticipantsUpdate(from, [user], "remove");
    }
  }
}
