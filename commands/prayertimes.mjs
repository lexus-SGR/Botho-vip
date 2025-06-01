import fetch from "node-fetch";

export default {
  name: "prayertimes",
  description: "Pata muda wa sala kwa mji kwa leo",
  category: "islamic",
  usage: "!prayertimes <jina la mji>",
  async execute(sock, msg, args) {
    if (args.length < 1) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "Tafadhali andika jina la mji mfano: !prayertimes Dar es Salaam",
      }, { quoted: msg });
    }

    const city = args.join(" ");
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=2`);
      const data = await res.json();

      if (data.code !== 200 || !data.data) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "Haikuweza kupata muda wa sala kwa mji huu. Jaribu mji mwingine.",
        }, { quoted: msg });
      }

      const timings = data.data.timings;
      const date = data.data.date.readable;
      const message = `🕌 *Muda wa Sala kwa ${city} - ${date}*\n
Fajr: ${timings.Fajr}
Sunrise: ${timings.Sunrise}
Dhuhr: ${timings.Dhuhr}
Asr: ${timings.Asr}
Maghrib: ${timings.Maghrib}
Isha: ${timings.Isha}
      `;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Tatizo limetokea kuwasiliana na API ya muda wa sala. Jaribu tena.",
      }, { quoted: msg });
    }
  }
};
