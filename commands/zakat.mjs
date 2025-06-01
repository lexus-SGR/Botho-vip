export default {
  name: "zakat",
  description: "Toa maelezo ya Zakat na jinsi ya kuhesabu",
  category: "islamic",
  usage: "!zakat",
  async execute(sock, msg) {
    const message = `
💰 *Zakat - Safi ya Mali*

Zakat ni moja ya nguzo tano za Uislamu. Ni sehemu ya mali ambayo Muislamu anatakiwa kutoa kila mwaka kwa masikini na wenye haja.

Nani anapaswa kulipa Zakat?
- Mtu mwenye mali ya thamani ya Nishab (sawa na dhahabu ya kilo 85 au fedha ya kilo 595)
- Mali inapaswa kumilikiwa kwa angalau mwaka mmoja (Hawl)

Jinsi ya kuhesabu Zakat:
- Zakat ni 2.5% (1/40) ya mali yenye thamani inayofikia Nishab.
- Mali ni kama fedha, dhahabu, biashara, mavuno, na kadhalika.

*Maneno ya Mtume Muhammad (SAW):*
“Msitoe mali kwa mtu aliye na mali ndogo, lakini chukua kutoka kwa mtu aliye na mali nyingi.” (Sahih Muslim)

Kumbuka kutoa Zakat kwa wakati na kwa watu wanaostahili.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
