import fetch from "node-fetch";

export default {
  name: "😁image",
  description: "Tafuta picha kupitia Unsplash kwa njia fupi 🖼️",
  category: "tools",
  usage: "!image beach",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Tumia: !image beach" }, { quoted: msg });

    const query = args.join(" ");
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_KEY}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha imepatikana." }, { quoted: msg });
    }

    const photo = data.results[Math.floor(Math.random() * data.results.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: photo.urls.small },
      caption: `🖼️ ${query} - Unsplash\n📷: ${photo.user.name}`,
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🖼️", key: msg.key } });
  }
};
