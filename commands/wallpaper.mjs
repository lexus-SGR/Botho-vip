import fetch from "node-fetch";

export default {
  name: "😁wallpaper",
  description: "Tafuta wallpaper nzuri kutoka Unsplash",
  category: "tools",
  usage: "!wallpaper mountains",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja neno. Mfano: !wallpaper mountain" }, { quoted: msg });

    const query = args.join(" ");
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${process.env.UNSPLASH_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna wallpaper imepatikana." }, { quoted: msg });
    }

    const pic = data.results[Math.floor(Math.random() * data.results.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: pic.urls.regular },
      caption: `🖼️ Wallpaper: ${query}\n📷 ${pic.user.name}`,
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🌄", key: msg.key } });
  }
};
