export const command = 'antiword'
export const desc = '🛑 Block messages containing bad words.'

let blockedWords = ['fuck', 'shit', 'bitch']
let antiwordGroups = {}

export const handler = async (m, { args }) => {
  if (!m.isGroup) return m.reply('❌ This command only works in groups.')
  if (!m.isAdmin) return m.reply('❌ Only admins can toggle anti-word.')

  const action = args[0]?.toLowerCase()
  if (action === 'on') {
    antiwordGroups[m.chat] = true
    return m.reply('✅ Anti-word is now *enabled*.')
  } else if (action === 'off') {
    antiwordGroups[m.chat] = false
    return m.reply('❎ Anti-word is now *disabled*.')
  } else {
    return m.reply('⚠️ Usage: antiword on/off')
  }
}

export const before = async (m, { client }) => {
  if (!m.isGroup) return
  if (!antiwordGroups[m.chat]) return

  for (const word of blockedWords) {
    if (m.body.toLowerCase().includes(word)) {
      await m.reply('🚫 That word is not allowed in this group.')
      break
    }
  }
}
