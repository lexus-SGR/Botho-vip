module.exports = {
  name: "status",
  description: "Show or update bot status (bio). Owner only can update.",
  async execute(sock, msg, args, from, sender) {
    try {
      const owner = process.env.BOT_OWNER + "@s.whatsapp.net";

      if (args.length === 0) {
        // On no args, show current bio
        const jid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const status = await sock.fetchStatus(jid).catch(() => null);
        await sock.sendMessage(from, { text: `📌 Current bot status:\n${status?.status || "No status set."}` });
        return;
      }

      if (sender !== owner) {
        await sock.sendMessage(from, { text: "❌ Only owner can update the bot status." });
        return;
      }

      const newStatus = args.join(" ");
      await sock.updateProfileStatus(newStatus);
      await sock.sendMessage(from, { text: `✅ Status updated to:\n${newStatus}` });
    } catch (error) {
      console.error("Status command error:", error);
      await sock.sendMessage(from, { text: `❌ Error updating status: ${error.message}` });
    }
  },
};
