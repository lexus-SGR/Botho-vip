import fetch from "node-fetch";

const TENOR_API_KEY = process.env.TENOR_API_KEY;

export async function execute(sock, msg, args) {
  try {
    if (!args.length) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Tafadhali tuma maneno ya kutafuta GIF. Mfano: !gif happy" });
      return;
    }

    const query = args.join(" ");
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=1&media_filter=gif`;

    const response = await fetch(url);
    const json = await response.json();

    if (!json.results || json.results.length === 0) {
      await sock.sendMessage(msg.key.remoteJid, { text: `Samahani, sijaweza kupata GIF ya "${query}". Jaribu tena.` });
      return;
    }

    const gifUrl = json.results[0].media_formats.gif.url;

    await sock.sendMessage(msg.key.remoteJid, {
      video: { url: gifUrl },
      gifPlayback: true,
      caption: `GIF kwa ajili ya: ${query} 😄`
    });

  } catch (error) {
    console.error("Error in !gif command:", error);
    await sock.sendMessage(msg.key.remoteJid, { text: "Kuna tatizo limetokea wakati wa kutafuta GIF. Jaribu tena baadaye." });
  }
}
