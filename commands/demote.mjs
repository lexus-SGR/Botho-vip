export const command = 'demote'
export const desc = '🔻 Demotes an admin to regular member.'

export const handler = async (m, { client, args }) => {
  if (!m.isGroup) return m.reply('❌ This command can only be used in groups.')

  let number
  if (m.quoted) {
    number = m.quoted.sender
  } else if (args[0]) {
    number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    return m.reply('❌ Please reply to a user or provide a number to demote.')
  }

  const admins = (await client.groupMetadata(m.chat)).participants.filter(p => p.admin !== null).map(p => p.id)
  if (!admins.includes(m.sender)) return m.reply('🚫 Only admins can demote others.')

  try {
    await client.groupParticipantsUpdate(m.chat, [number], 'demote')
    await m.reply('✅ User has been demoted from admin.')
  } catch (err) {
    console.error(err)
    await m.reply('❌ Failed to demote user.')
  }
}
