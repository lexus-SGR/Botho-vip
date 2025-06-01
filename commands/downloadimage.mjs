export default {
  name: "downloadimage",
  description: "Download picha kutoka kwenye link au message",
  category: "download",
  usage: "!downloadimage <image_url> au reply picha",
  async execute(sock, msg) {
    const { from, body, quoted, key } = msg;

    try {
      let buffer;

      if (quoted && quoted.message.imageMessage) {
        // Download image from quoted message
        buffer = await sock.downloadMediaMessage(quoted);
      } else {
        // Get URL from command
        const url = body.split(' ')[1];
        if (!url) return await sock.sendMessage(from, { text: "Tafadhali tuma link ya picha au reply picha." }, { quoted: msg });
        
        // Download from URL (simple fetch)
        const res = await fetch(url);
        if (!res.ok) return await sock.sendMessage(from, { text: "Link si sahihi au picha haipatikani." }, { quoted: msg });

        buffer = Buffer.from(await res.arrayBuffer());
      }

      // Send image back
      await sock.sendMessage(from, { image: buffer }, { quoted: msg });

      // Emoji react
      await sock.sendMessage(from, { react: { text: "🖼️", key } });

    } catch (e) {
      await sock.sendMessage(from, { text: "Kuna tatizo kudownload picha." }, { quoted: msg });
    }
  }
};
