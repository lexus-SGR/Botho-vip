export default {
  name: "ramadhan",
  description: "Toa maelezo kuhusu mwezi wa Ramadhani na umuhimu wake",
  category: "islamic",
  usage: "!ramadhan",
  async execute(sock, msg) {
    const message = `
🌙 *Ramadhani - Mwezi Mtukufu wa Kufunga*

Ramadhani ni mwezi wa tisa katika kalenda ya Kiislamu, na ni mwezi mtukufu ambapo Waislamu hufunga kuanzia alfajiri hadi magharibi kama ibada ya kifungo (Sawm).

Umuhimu wa Ramadhani:
- Ni mwezi wa kusafisha nafsi na kuimarisha imani.
- Mfungo unafungua njia ya msamaha na thawabu kubwa.
- Usiku wa Qadr (Lailatul Qadr) huwepo, ambao ni bora zaidi ya miaka elfu.
- Kuongeza ibada kama kusoma Qur'an, dua, na sadaka.

*Maneno ya Mtume Muhammad (SAW):*
“Mwezi huu umekuja kwenu wenye baraka, ndani yake kuna usiku bora kuliko miaka elfu.” (Sahih Bukhari)

Hakikisheni mnautumia huu mwezi kwa ibada, kusameheana, na kusaidia wanyonge.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
