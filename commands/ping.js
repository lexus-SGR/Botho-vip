export default {
  description: 'Check if bot is alive',
  emoji: '🏓',
  async execute(message, args) {
    try {
      await message.react(this.emoji);
      await message.reply('Pong! 🏓');
    } catch (err) {
      console.error(err);
    }
  }
};
