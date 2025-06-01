import fetch from "node-fetch";

const TENOR_API_KEY = process.env.TENOR_API_KEY;

const answers = [
  "Ndiyo, hakika!",
  "Inawezekana sana.",
  "Usitegemee hilo.",
  "Labda baadaye.",
  "Sina uhakika.",
  "Hapana kabisa!",
  "Jaribu tena baadaye.",
];

export async function execute(sock, msg, args) {
  try {
    if (!args.length) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Tafadhali uliza swali. Mfano: !8ball nitapata kazi?" });
      return;
    }

    const question = args.join(" ");
    const answer = answers[Math.floor(Math.random() * answers.length)];

    // Pata GIF ya 'magic' kutoka Tenor
    const url = `https://tenor.googleapis.com/v2/search?q=magic&key=${TENOR_API_KEY}&limit=1&media_filter=gif`;
    const response = await fetch(url);
    const json = await response.json();

    const gifUrl = json.results && json.results[0] ? json.results[0].media_formats.gif.url : null;

    let message = {
      text: `Swali: ${question}\nJibu: ${answer}`
    };

    if (gifUrl) {
      message = {
        video: { url: gifUrl },
        gifPlayback: true,
        caption: `Swali: ${question}\nJibu: ${answer}`,
      };
    }

    await sock.sendMessage(msg.key.remoteJid, message);

  } catch (error) {
    console.error("Error in !8ball command:", error);
    await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea wakati wa kujibu swali. Jaribu tena." });
  }
}
