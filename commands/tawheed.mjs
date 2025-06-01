export default {
  name: "tawheed",
  description: "Toa maelezo ya msingi kuhusu Tawheed - Umoja wa Mwenyezi Mungu",
  category: "islamic",
  usage: "!tawheed",
  async execute(sock, msg) {
    const message = `
🕋 *Tawheed - Umoja wa Mwenyezi Mungu*

- Tawheed ni imani kuwa kuna Mungu Mmoja tu, asiye na mshirika.
- Ni msingi wa Uislamu na msingi wa ibada zote.
- Kuna aina tatu za Tawheed:
  1. Tawheed ar-Ruboobiyyah (Umoja wa Mungu katika uumbaji na utawala)
  2. Tawheed al-Uloohiyyah (Umoja wa Mungu katika ibada)
  3. Tawheed al-Asma wa Sifat (Umoja wa Mungu katika majina na sifa zake)

*Maneno ya Mtume Muhammad (SAW):*
_"Mungu hana mpenzi wa ibada isipokuwa Yeye Mmoja."_

Kumbuka, ibada zote zinapaswa kwenda kwa Mwenyezi Mungu pekee.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
