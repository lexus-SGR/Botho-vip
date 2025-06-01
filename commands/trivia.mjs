import fetch from "node-fetch";

const TENOR_API_KEY = process.env.TENOR_API_KEY;

const triviaQuestions = [
  {
    question: "Nchi gani ni kubwa zaidi duniani kwa eneo?",
    answer: "Russia"
  },
  {
    question: "Bahari kubwa zaidi duniani ni ipi?",
    answer: "Bahari ya Pasifiki"
  },
  {
    question: "Mwezi wa mwaka una siku ngapi?",
    answer: "30 au 31"
  },
];

export async function execute(sock, msg, args) {
  try {
    const trivia = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

    // Pata GIF ya 'thinking' kutoka Tenor
    const url = `https://tenor.googleapis.com/v2/search?q=thinking&key=${TENOR_API_KEY}&limit=1&media_filter=gif`;
    const response = await fetch(url);
    const json = await response.json();

    const gifUrl = json.results && json.results[0] ? json.results[0].media_formats.gif.url : null;

    let message = {
      text: `Trivia:\n${trivia.question}\nJibu: ${trivia.answer}`
    };

    if (gifUrl) {
      message = {
        video: { url: gifUrl },
        gifPlayback: true,
        caption: `Trivia:\n${trivia.question}\nJibu: ${trivia.answer}`
      };
    }

    await sock.sendMessage(msg.key.remoteJid, message);

  } catch (error) {
    console.error("Error in !trivia command:", error);
    await sock.sendMessage(msg.key.remoteJid, { text: "Tatizo lilitokea kuleta trivia. Jaribu tena." });
  }
}
