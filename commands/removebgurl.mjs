import fetch from "node-fetch";

export default {
  name: "😁removebgurl",
  description: "Ondoa background kwa URL (Remove.bg)",
  category: "removebg",
  async execute(sock, msg, args) {
    if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: "Tuma link ya picha." }, { quoted: msg });
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image_url: args[0], size: "auto" })
    });
    if (!response.ok) return sock.sendMessage(msg.key.remoteJid, { text: `Kosa: ${response.statusText}` }, { quoted: msg });
    const imageBuffer = await response.buffer();
    await sock.sendMessage(msg.key.remoteJid, { image: imageBuffer, caption: "Background imeondolewa kwa URL! 🔥" }, { quoted: msg });
  }
};
