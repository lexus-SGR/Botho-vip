export const command = 'antilink'
export const desc = '🚫 Enable or disable WhatsApp group link blocking.'

let antilinkGroups = {}

export const handler = async (m, { args }) => {
  if (!m.isGroup) return m.reply('❌ This command only works in groups.')
  if (!m.isAdmin) return m.reply('❌ Only admins can toggle anti-link.')

  const action = args[0]?.toLowerCase()
  if (action === 'on') {
    antilinkGroups[m.chat] = true
    return m.reply('✅ Anti-link is now *enabled* in this group.')
  } else if (action === 'off') {
    antilinkGroups[m.chat] = false
    return m.reply('❎ Anti-link is now *disabled* in this group.')
  } else {
    return m.reply('⚠️ Usage: antilink on/off')
  }
}

export const before = async (m, { client }) => {
  if (!m.isGroup) return
  if (!antilinkGroups[m.chat]) return
  if (m.fromMe) return

  const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
  if (linkRegex.test(m.body)) {
    const groupMetadata = await client.groupMetadata(m.chat)
    const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id)
    if (!admins.includes(m.sender)) {
      await m.reply('🚫 Group links are not allowed here!')
      await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
  }
}
