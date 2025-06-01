export default {
  name: "downloadgif",
  description: "Download GIF kutoka kwenye link au reply",
  category: "download",
  usage: "!downloadgif <gif_url> au reply gif",
  async execute(sock, msg) {
    const { from, body, quoted, key } = msg;

    try {
      let buffer;

      if (quoted && quoted.message.videoMessage && quoted.message.videoMessage.gifPlayback) {
        buffer = await sock.downloadMediaMessage(quoted);
      } else {
        const url = body.split(' ')[1];
        if (!url) return await sock.sendMessage(from, { text: "Tafadhali tuma link ya gif au reply gif." }, { quoted: msg });

        const res = await fetch(url);
        if (!res.ok) return await sock.sendMessage(from, { text: "Link si sahihi au gif haipatikani." }, { quoted: msg });

        buffer = Buffer.from(await res.arrayBuffer());
      }

      await sock.sendMessage(from, { video: buffer, gifPlayback: true }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "🎞️", key } });

    } catch (e) {
      await sock.sendMessage(from, { text: "Kuna tatizo kudownload gif." }, { quoted: msg });
    }
  }
};
