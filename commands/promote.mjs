export const command = 'promote'
export const desc = '👑 Promotes a group member to admin.'

export const handler = async (m, { client, args }) => {
  if (!m.isGroup) return m.reply('❌ This command can only be used in groups.')

  let number
  if (m.quoted) {
    number = m.quoted.sender
  } else if (args[0]) {
    number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    return m.reply('❌ Please reply to a user or provide a number to promote.')
  }

  const admins = (await client.groupMetadata(m.chat)).participants.filter(p => p.admin !== null).map(p => p.id)
  if (!admins.includes(m.sender)) return m.reply('🚫 Only admins can promote others.')

  try {
    await client.groupParticipantsUpdate(m.chat, [number], 'promote')
    await m.reply('✅ User has been promoted to admin!')
  } catch (err) {
    console.error(err)
    await m.reply('❌ Failed to promote user.')
  }
}
