// prayer-reminder.js
module.exports = {
  name: "prayerreminder",
  description: "Send Jumuah or Eid prayer reminders 📢",
  usage: "prayerreminder <jumuah|eid>",
  category: "islamic",
  react: "📢",
  sudo: true,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) {
      return sock.sendMessage(from, { text: "❌ Usage: prayerreminder <jumuah|eid>" }, { quoted: msg });
    }
    const type = args[0].toLowerCase();

    if (type === "jumuah") {
      const text = "🕌 Reminder: Jumuah Prayer is every Friday at 1:00 PM. Don't miss the congregational prayer!";
      await sock.sendMessage(from, { text }, { quoted: msg });
    } else if (type === "eid") {
      const text = "🌙 Reminder: Eid prayer will be held at 8:00 AM on the first day of Shawwal. Prepare your clothes and takbeer!";
      await sock.sendMessage(from, { text }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: "❌ Unknown reminder type. Use 'jumuah' or 'eid'." }, { quoted: msg });
    }
  }
};
