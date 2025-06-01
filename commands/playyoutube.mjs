import ytdl from "ytdl-core";
import yts from "yt-search";

export default {
  name: "playyt",
  description: "Cheza wimbo kutoka YouTube kwa jina au link",
  category: "music",
  usage: "!playyt <jina la wimbo au link ya YouTube>",
  async execute(sock, msg) {
    const { from, body, key } = msg;

    try {
      const query = body.split(' ').slice(1).join(' ');
      if (!query) {
        return await sock.sendMessage(from, { text: "Tafadhali tuma jina la wimbo au link ya YouTube." }, { quoted: msg });
      }

      // Tafuta video kwa jina
      let video;
      if (ytdl.validateURL(query)) {
        video = { url: query };
      } else {
        const search = await yts(query);
        if (!search || !search.videos.length) return await sock.sendMessage(from, { text: "Hakuna matokeo ya wimbo huo." }, { quoted: msg });
        video = search.videos[0];
      }

      // Pakua stream ya audio
      const stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });

      // Collect stream data to buffer (simple approach)
      let chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      const buffer = Buffer.concat(chunks);

      // Tuma audio kama voice note
      await sock.sendMessage(from, { audio: buffer, mimetype: "audio/mpeg", ptt: true }, { quoted: msg });

      // React with music emoji
      await sock.sendMessage(from, { react: { text: "🎶", key } });

    } catch (error) {
      await sock.sendMessage(from, { text: "Kuna tatizo kuplay wimbo." }, { quoted: msg });
    }
  }
};
