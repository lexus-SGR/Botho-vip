import axios from 'axios';

export default {
  description: 'Translate text to Swahili using LibreTranslate API',
  emoji: '🌐',
  async execute(message, args) {
    if (args.length === 0) {
      return message.reply('Please provide text to translate. Usage: 😁translate Hello world');
    }

    try {
      await message.react(this.emoji);
      const text = args.join(' ');
      const response = await axios.post('https://libretranslate.de/translate', {
        q: text,
        source: 'en',
        target: 'sw',
        format: 'text'
      });
      const translated = response.data.translatedText;
      await message.reply(`Translation:\n${translated}`);
    } catch (err) {
      console.error(err);
      await message.reply('Failed to translate text.');
    }
  }
};
