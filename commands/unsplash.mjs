import fetch from "node-fetch";

export default {
  name: "😁unsplash",
  description: "Tafuta picha kutoka Unsplash kwa neno 📸",
  category: "tools",
  usage: "!unsplash nature",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja neno la kutafuta picha. Mfano: !unsplash nature" }, { quoted: msg });

    const query = encodeURIComponent(args.join(" "));
    const apiKey = process.env.UNSPLASH_KEY;
    const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.urls || !data.urls.small) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha iliyo patikana." }, { quoted: msg });
      }

      const caption = `📸 Picha ya *${args.join(" ")}* kutoka Unsplash\n📷 Mwandishi: ${data.user.name}`;

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: data.urls.small },
        caption,
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: "📸", key: msg.key } });

    } catch (err) {
      console.error("Unsplash error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta picha." });
    }
  }
};
