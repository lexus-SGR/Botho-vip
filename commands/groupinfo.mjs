export const command = 'groupinfo'
export const desc = 'ℹ️ Onyesha taarifa za group kama jina, id, watoa ujumbe, n.k.'

export const handler = async (m, { client }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Amri hii ni kwa group tu!')

    const groupMetadata = await client.groupMetadata(m.chat)
    const groupAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id)
    const groupMembersCount = groupMetadata.participants.length
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Hakuna maelezo ya group'

    const info = `📌 *Taarifa za Group:*\n` +
                 `👥 Jina: ${groupName}\n` +
                 `🆔 ID: ${m.chat}\n` +
                 `👑 Wana admin: ${groupAdmins.length}\n` +
                 `👥 Wana group jumla: ${groupMembersCount}\n` +
                 `📝 Maelezo: ${groupDesc}`

    await m.reply(info)
  } catch (err) {
    console.error(err)
    await m.reply('❌ Imeshindikana kupata taarifa za group.')
  }
}
