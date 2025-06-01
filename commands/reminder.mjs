export default {
  name: "reminder",
  description: "⏰ Set reminder / Weka ukumbusho",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "⏰", key: msg.key } });

      if (args.length < 2) {
        await sock.sendMessage(from, { text: "⚠️ Usage: !reminder <seconds> <message>\nMfano: !reminder 10 Hello\nTafadhali toa muda na ujumbe." });
        return;
      }

      const seconds = parseInt(args[0], 10);
      if (isNaN(seconds) || seconds < 1) {
        await sock.sendMessage(from, { text: "⚠️ Invalid time specified.\nMuda sio sahihi." });
        return;
      }

      const reminderMsg = args.slice(1).join(" ");
      await sock.sendMessage(from, { text: `✅ Reminder set for ${seconds} seconds.\nUmeweka ukumbusho wa sekunde ${seconds}.` });

      setTimeout(async () => {
        await sock.sendMessage(from, { text: `⏰ Reminder: ${reminderMsg}` });
      }, seconds * 1000);

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error setting reminder.\nHitilafu wakati wa kuweka ukumbusho." });
      console.error("Reminder command error:", error);
    }
  },
};
