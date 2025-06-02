export default {
  name: "😁unsplashmenu",
  description: "Onyesha command zote za Unsplash 📸",
  category: "tools",
  usage: "!unsplashmenu",
  async execute(sock, msg) {
    const menu = `
📸 *Unsplash Commands:*
- !unsplash [query]
- !unsplashRandom
- !unsplashCollection [name]
- !unsplashUser [username]
- !image [query]
- !wallpaper [keyword]
- !color [red/blue/green...]
- !imageofday
- !photoid [id]
    `.trim();

    await sock.sendMessage(msg.key.remoteJid, { text: menu }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "📸", key: msg.key } });
  }
};
