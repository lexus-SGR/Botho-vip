export const command = 'remove'
export const desc = '➖ Removes a user from the group.'

export const handler = async (m, { client, args }) => {
  if (!m.isGroup) return m.reply('❌ This command can only be used in groups.')

  let number
  if (m.quoted) {
    number = m.quoted.sender
  } else if (args[0]) {
    number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    return m.reply('❌ Please reply to a user or provide a number to remove.')
  }

  const admins = (await client.groupMetadata(m.chat)).participants.filter(p => p.admin !== null).map(p => p.id)
  if (!admins.includes(m.sender)) return m.reply('🚫 Only group admins can remove members.')

  try {
    await client.groupParticipantsUpdate(m.chat, [number], 'remove')
    await m.reply(`✅ User has been removed from the group.`)
  } catch (err) {
    console.error(err)
    await m.reply('❌ Failed to remove user. Ensure the number is correct and not already removed.')
  }
}
