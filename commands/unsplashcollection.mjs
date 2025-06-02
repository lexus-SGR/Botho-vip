import fetch from "node-fetch";

export default {
  name: "😁unsplashCollection",
  description: "Picha random kutoka Unsplash collection 📚",
  category: "tools",
  usage: "!unsplashCollection nature",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja jina la collection. Mfano: !unsplashCollection nature" }, { quoted: msg });

    const query = encodeURIComponent(args.join(" "));
    const apiKey = process.env.UNSPLASH_KEY;
    const searchUrl = `https://api.unsplash.com/search/collections?query=${query}&client_id=${apiKey}`;

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna collections iliyo patikana." }, { quoted: msg });
      }

      const collection = data.results[0];
      const collectionId = collection.id;
      const photosUrl = `https://api.unsplash.com/collections/${collectionId}/photos?client_id=${apiKey}`;

      const photosRes = await fetch(photosUrl);
      const photosData = await photosRes.json();

      if (!photosData.length) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha kwenye collection hii." }, { quoted: msg });
      }

      const photo = photosData[Math.floor(Math.random() * photosData.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: photo.urls.small },
        caption: `📚 Picha kutoka collection: ${collection.title}\n📷 Mwandishi: ${photo.user.name}`,
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: "📚", key: msg.key } });

    } catch (err) {
      console.error("Unsplash collection error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta picha za collection." });
    }
  }
};
