export const command = 'antibot'
export const desc = '🤖 Prevents other bots from joining the group.'

let antibotGroups = {}

export const handler = async (m, { args }) => {
  if (!m.isGroup) return m.reply('❌ This command only works in groups.')
  if (!m.isAdmin) return m.reply('❌ Only admins can toggle anti-bot.')

  const action = args[0]?.toLowerCase()
  if (action === 'on') {
    antibotGroups[m.chat] = true
    return m.reply('✅ Anti-bot is now *enabled*.')
  } else if (action === 'off') {
    antibotGroups[m.chat] = false
    return m.reply('❎ Anti-bot is now *disabled*.')
  } else {
    return m.reply('⚠️ Usage: antibot on/off')
  }
}

export const participantUpdate = async ({ id, participants, action }, { client }) => {
  if (!antibotGroups[id]) return
  if (action !== 'add') return

  for (const user of participants) {
    if (user.endsWith('g.us') || user.endsWith('bot') || user.includes(':')) {
      await client.groupParticipantsUpdate(id, [user], 'remove')
    }
  }
}
