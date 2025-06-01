export const command = 'antidelete'
export const desc = '📥 Show deleted messages in the group.'

let antideleteGroups = {}

export const handler = async (m, { args }) => {
  if (!m.isGroup) return m.reply('❌ Only works in groups.')
  if (!m.isAdmin) return m.reply('❌ Only admins can toggle anti-delete.')

  const action = args[0]?.toLowerCase()
  if (action === 'on') {
    antideleteGroups[m.chat] = true
    return m.reply('✅ Anti-delete is now *enabled*.')
  } else if (action === 'off') {
    antideleteGroups[m.chat] = false
    return m.reply('❎ Anti-delete is now *disabled*.')
  } else {
    return m.reply('⚠️ Usage: antidelete on/off')
  }
}

export const messageDelete = async (message, { client }) => {
  const groupId = message.key.remoteJid
  if (!antideleteGroups[groupId]) return

  const participant = message.key.participant
  const content = message.message?.conversation || message.message?.extendedTextMessage?.text || '[media]'
  await client.sendMessage(groupId, {
    text: `🕵️ Message deleted by @${participant.split('@')[0]}:\n\n${content}`,
    mentions: [participant]
  })
}
