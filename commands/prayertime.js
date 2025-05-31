module.exports = {
  name: "prayertime",
  description: "Get mock prayer times by city 🕌",
  usage: "!prayertime dar",
  category: "islamic",
  react: "🕌",
  async execute(sock, msg, args, from) {
    const city = args.join(" ").toLowerCase();
    if (!city) return sock.sendMessage(from, { text: "Please provide a city name, e.g., !prayertime Dar" }, { quoted: msg });

    // Static mock data
    if (city === "dar") {
      return sock.sendMessage(from, {
        text: `🕌 *Prayer Times for Dar es Salaam*\n\nFajr: 05:08 AM\nDhuhr: 12:30 PM\nAsr: 03:45 PM\nMaghrib: 06:25 PM\nIsha: 07:45 PM`
      }, { quoted: msg });
    }

    sock.sendMessage(from, { text: `❌ No prayer time data for ${city}.` }, { quoted: msg });
  }
};
