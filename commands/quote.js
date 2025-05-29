const quotes = [
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it."
];

module.exports = {
  name: "quote",
  description: "Send a random motivational quote 💡",
  category: "fun",
  react: "💡",
  usage: "quote",
  async execute(sock, msg, args, from, sender) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(from, { text: `💡 *Motivational Quote:*\n\n"${randomQuote}"` }, { quoted: msg });
  }
};
