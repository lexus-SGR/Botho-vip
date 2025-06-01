export default {
  name: "downloadaudio",
  description: "Download audio kutoka kwenye link au message",
  category: "download",
  usage: "!downloadaudio <audio_url> au reply audio",
  async execute(sock, msg) {
    const { from, body, quoted, key } = msg;

    try {
      let buffer;

      if (quoted && quoted.message.audioMessage) {
        buffer = await sock.downloadMediaMessage(quoted);
      } else {
        const url = body.split(' ')[1];
        if (!url) return await sock.sendMessage(from, { text: "Tafadhali tuma link ya audio au reply audio." }, { quoted: msg });

        const res = await fetch(url);
        if (!res.ok) return await sock.sendMessage(from, { text: "Link si sahihi au audio haipatikani." }, { quoted: msg });

        buffer = Buffer.from(await res.arrayBuffer());
      }

      await sock.sendMessage(from, { audio: buffer, mimetype: "audio/mpeg" }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "🎧", key } });

    } catch (e) {
      await sock.sendMessage(from, { text: "Kuna tatizo kudownload audio." }, { quoted: msg });
    }
  }
};
