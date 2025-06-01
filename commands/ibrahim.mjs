export default {
  name: "ibrahim",
  description: "Toa maelezo ya maisha na mafanikio ya Mtume Ibrahim (AS)",
  category: "islamic",
  usage: "!ibrahim",
  async execute(sock, msg) {
    const message = `
🕋 *Mtume Ibrahim (AS) - Baba wa Waislamu*

- Ibrahim alizaliwa katika nyumba ya mfalme wa mchemrini na alikuwa mpinzani wa makafiri.
- Alikataa kuabudu sanamu na aliabudu Allah mmoja.
- Mtume Ibrahim alijitolea kwa Mungu na alikubaliwa kuokoa mji wa Makka kutoka hatari.
- Alijenga Kaaba pamoja na mtoto wake Ismail (AS).

*Hadithi ya Ibrahimu na Moto:*
Alipotupwa kwenye moto na makafiri, Allah alimwokoa kwa kuamuru moto uwe baridi na salama kwake.

Mtume Ibrahim ni mfano wa imani na kujitolea bila mashaka.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
