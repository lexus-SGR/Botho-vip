import fetch from "node-fetch";

export default {
  name: "😁photoid",
  description: "Pata picha kwa kutumia ID ya Unsplash 🔍",
  category: "tools",
  usage: "!photoid abc123",
  async execute(sock, msg, args) {
    if (!args.length) return await sock.sendMessage(msg.key.remoteJid, { text: "Taja ID ya picha. Mfano: !photoid AbCdEf123" }, { quoted: msg });

    const id = args[0];
    const url = `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.urls) {
      return await sock.sendMessage(msg.key.remoteJid, { text: "Hakuna picha kwa ID hiyo." }, { quoted: msg });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: data.urls.regular },
      caption: `🔍 Picha ID: ${id}\n📷 ${data.user.name}`,
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🔍", key: msg.key } });
  }
};
