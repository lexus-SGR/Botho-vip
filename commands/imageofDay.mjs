import fetch from "node-fetch";

export default {
  name: "😁imageofday",
  description: "Picha ya siku kutoka Unsplash ☀️",
  category: "tools",
  usage: "!imageofday",
  async execute(sock, msg) {
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_KEY}`);
    const data = await res.json();

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: data.urls.regular },
      caption: `☀️ Picha ya Siku - ${data.user.name}`,
    }, { quoted: msg });

    await sock.sendMessage(msg.key.remoteJid, { react: { text: "☀️", key: msg.key } });
  }
};
