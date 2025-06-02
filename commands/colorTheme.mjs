import fetch from "node-fetch";

export default {
  name: "😁color",
  description: "Tafuta picha zenye theme ya rangi fulani 🎨",
  category: "tools",
  usage: "!color red",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja rangi. Mfano: !color red" }, { quoted: msg });

    const color = args.join(" ");
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(color)}&client_id=${process.env.UNSPLASH_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha ya rangi hiyo." }, { quoted: msg });
    }

    const photo = data.results[0];

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: photo.urls.small },
      caption: `🎨 Rangi: ${color}\n📷 ${photo.user.name}`,
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🎨", key: msg.key } });
  }
};
