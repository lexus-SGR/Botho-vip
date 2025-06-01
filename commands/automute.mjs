export const command = 'automute'
export const desc = '⏱️ Automatically mute a group at a specific hour.'

let automuteGroups = {} // { groupId: "HH:MM" }

export const handler = async (m, { args }) => {
  if (!m.isGroup || !m.isAdmin) return m.reply('❌ Only admins in groups can set automute.')

  const time = args[0]
  if (!/^\d\d:\d\d$/.test(time)) return m.reply('⏰ Please provide time in HH:MM format.\nExample: `automute 22:00`')

  automuteGroups[m.chat] = time
  return m.reply(`✅ Group will be muted automatically at *${time}*.`)
}

export const cron = async ({ client }) => {
  const now = new Date()
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  const currentTime = `${hour}:${minute}`

  for (const [groupId, time] of Object.entries(automuteGroups)) {
    if (time === currentTime) {
      await client.groupSettingUpdate(groupId, 'announcement')
      await client.sendMessage(groupId, { text: '🔇 This group has been automatically muted.' })
    }
  }
}
