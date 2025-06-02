import fetch from "node-fetch";

export default {
  name: "😁covidstats",
  description: "Taarifa za COVID-19 kwa nchi 🌍",
  category: "tools",
  usage: "!covidstats Tanzania",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja nchi. Mfano: !covidstats Tanzania" }, { quoted: msg });

    const country = args.join(" ");
    try {
      const res = await fetch(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`);
      const data = await res.json();

      if (data.message) {
        return await sock.sendMessage(msg.key.remoteJid, { text: `Hakuna taarifa za COVID-19 kwa nchi: ${country}` }, { quoted: msg });
      }

      const msgText = `🦠 COVID-19 Stats kwa
