export default {
  name: "downloadvideo",
  description: "Download video kutoka kwenye link au message",
  category: "download",
  usage: "!downloadvideo <video_url> au reply video",
  async execute(sock, msg) {
    const { from, body, quoted, key } = msg;

    try {
      let buffer;

      if (quoted && quoted.message.videoMessage) {
        buffer = await sock.downloadMediaMessage(quoted);
      } else {
        const url = body.split(' ')[1];
        if (!url) return await sock.sendMessage(from, { text: "Tafadhali tuma link ya video au reply video." }, { quoted: msg });

        const res = await fetch(url);
        if (!res.ok) return await sock.sendMessage(from, { text: "Link si sahihi au video haipatikani." }, { quoted: msg });

        buffer = Buffer.from(await res.arrayBuffer());
      }

      await sock.sendMessage(from, { video: buffer }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "🎥", key } });

    } catch (e) {
      await sock.sendMessage(from, { text: "Kuna tatizo kudownload video." }, { quoted: msg });
    }
  }
};
