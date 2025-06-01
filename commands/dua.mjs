export default {
  name: "dua",
  description: "Toa dua maarufu ya kuomba msaada",
  category: "islamic",
  usage: "!dua",
  async execute(sock, msg) {
    const duaText = `
🤲 Dua Maarufu ya Msaada

"اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَالعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ"

Allahumma inni as'aluka al-'afwa wal-'afiyah fid-dunya wal-akhirah.

Maana: Ee Mwenyezi Mungu, naakuomba uniepushe na adhabu na unipatie afya njema duniani na akhera.
    `;
    await sock.sendMessage(msg.key.remoteJid, { text: duaText }, { quoted: msg });
  }
};
