const stories = [
  {
    title: "Hadithi ya Mvua na Mtume Nuhu (AS)",
    content: `Katika zama za kale, Mtume Nuhu aliwaambia watu wake kuacha dhambi. Alijenga safina kwa amri ya Allah kabla ya mvua kubwa iliyofurika ulimwengu.\n
    Hadithi hii inatufundisha kuwa kushika msimamo na imani kwa Mungu ni muhimu hata kama wengine hawatuelewi.`,
  },
  {
    title: "Hadithi ya Huruma ya Mtume Muhammad (SAW)",
    content: `Mtume Muhammad alikuwa na huruma kwa kila mtu, hata kwa wanyama na viumbe wote.\n
    Alisema, "Moyo wa mwenye huruma hupewa rehema na Mwenyezi Mungu."`,
  },
  {
    title: "Hadithi ya Kushukuru",
    content: `Msikilizaji aliuliza Mtume Muhammad, "Ninashukuruje kwa kila jambo?"\n
    Mtume akasema, "Sema Alhamdulillah kila siku, hata ukipata changamoto."`,
  }
];

export default {
  name: "hadithi",
  description: "Toa hadithi fupi za Kiislamu kwa kumbuka na kutafakari",
  category: "islamic",
  usage: "!hadithi",
  async execute(sock, msg) {
    try {
      const randomIndex = Math.floor(Math.random() * stories.length);
      const story = stories[randomIndex];

      const message = `📖 *${story.title}*\n\n${story.content}`;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "Tatizo limetokea kutoa hadithi. Jaribu tena.",
      }, { quoted: msg });
    }
  }
};
