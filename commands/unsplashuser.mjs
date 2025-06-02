import fetch from "node-fetch";

export default {
  name: "😁unsplashUser",
  description: "Picha random kutoka mtumiaji wa Unsplash 📷",
  category: "tools",
  usage: "!unsplashUser username",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja username wa Unsplash. Mfano: !unsplashUser john" }, { quoted: msg });

    const username = args[0];
    const apiKey = process.env.UNSPLASH_KEY;
    const url = `https://api.unsplash.com/users/${username}/photos?client_id=${apiKey}`;

    try {
      const res = await fetch(url);
      const photos = await res.json();

      if (!photos || photos.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha kutoka mtumiaji huyu." }, { quoted: msg });
      }

      const photo = photos[Math.floor(Math.random() * photos.length)];

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: photo.urls.small },
        caption: `📷 Picha kutoka kwa ${username}`,
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: "📷", key: msg.key } });

    } catch (err) {
      console.error("Unsplash user error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta picha kutoka mtumiaji." });
    }
  }
};
