import fetch from "node-fetch";

export default {
  name: "😁unsplashRandom",
  description: "Picha random kabisa kutoka Unsplash 🌈",
  category: "tools",
  usage: "!unsplashRandom",
  async execute(sock, msg) {
    const apiKey = process.env.UNSPLASH_KEY;
    const url = `https://api.unsplash.com/photos/random?client_id=${apiKey}`;

    try {
      const res = await fetch(url);
      const photo = await res.json();

      if (!photo || !photo.urls) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha iliyo patikana." }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: photo.urls.small },
        caption: `📸 Picha random kutoka Unsplash\n📷 Mwandishi: ${photo.user.name}`
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: "🌈", key: msg.key } });

    } catch (err) {
      console.error("Unsplash random error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta picha." });
    }
  }
};
