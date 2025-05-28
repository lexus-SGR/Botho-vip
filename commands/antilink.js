export default {
  description: 'Auto-remove users who send group links',
  emoji: '🚫',
  async execute(message, args, { groupMetadata, isAdmin, isBotAdmin, participants }) {
    try {
      const linkRegex = /(https?:\/\/)?(www\.)?(chat\.whatsapp\.com\/[A-Za-z0-9]+)/gi;

      if (!groupMetadata) return;
      if (!isBotAdmin) return message.reply('🚫 I need admin rights to remove users.');
      if (isAdmin) return; // Don't act on admin

      if (linkRegex.test(message.text)) {
        await message.react(this.emoji);
        await message.reply(`🚫 Link detected!\nRemoving...`);

        // Toa mjumbe
        await message.groupParticipantsUpdate(message.chat, [message.sender], 'remove');
      }
    } catch (err) {
      console.error(err);
      await message.reply('⚠️ Failed to remove user.');
    }
  }
};
