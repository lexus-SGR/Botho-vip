const jokes = [
  'Why don’t scientists trust atoms? Because they make up everything!',
  'I told my computer I needed a break, and now it won’t stop sending me Kit-Kats.',
  'Why did the scarecrow win an award? Because he was outstanding in his field!',
  'Why don’t programmers like nature? It has too many bugs.'
];

export default {
  description: 'Tell a random joke',
  emoji: '😂',
  async execute(message, args) {
    try {
      await message.react(this.emoji);
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      await message.reply(joke);
    } catch (err) {
      console.error(err);
    }
  }
};
