export const command = 'ban'
export const desc = '⛔ Ban a user from using the bot.'

global.bannedUsers = new Set()

export const handler = async (m, { args, client }) => {
  const mentioned = m.mentionedJid?.[0] || m.reply_message?.sender
  if (!mentioned) return m.reply('🙅 Tag or reply to the user you want to ban.')

  global.bannedUsers.add(mentioned)
  await m.reply(`🚫 @${mentioned.split('@')[0]} has been *banned*.`, null, { mentions: [mentioned] })
}
