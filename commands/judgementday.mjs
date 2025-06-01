export default {
  name: "judgmentday",
  description: "Toa maelezo kuhusu Siku ya Hukumu (Yaum al-Qiyamah) katika Uislamu",
  category: "islamic",
  usage: "!judgmentday",
  async execute(sock, msg) {
    const message = `
⚖️ *Siku ya Hukumu (Yaum al-Qiyamah)*

- Ni siku ambayo watu wote watafufuliwa baada ya kufa kwa ajili ya kuhukumiwa.
- Wafanyao mema watapewa thawabu ya Peponi (Jannah).
- Wafanyao mabaya wataadhibiwa kwa Moto wa Jahannam.
- Siku hiyo ni ya haki kamili, hakuna aibu wala dhulma.

*Qur'an inasema:*
_"Na ni siku ya kuhukumu, watu watagawanyika." (Surah Al-Qiyamah 75:13)_

Iwe tayari kwa siku hii kwa kufanya mema na kuacha mabaya.

    `;
    await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
  }
};
