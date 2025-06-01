export const command = 'add'
export const desc = '➕ Ongeza mtu kwenye group kwa kutumia namba yake (format: 2557xxxxxxx)'

export const handler = async (m, { client, args }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Amri hii ni kwa group tu!')
    if (!args[0]) return m.reply('❌ Tafadhali ingiza namba ya mtu unayetaka kumongeza.')

    const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    const admins = (await client.groupMetadata(m.chat)).participants.filter(p => p.admin !== null).map(p => p.id)
    if (!admins.includes(m.sender)) return m.reply('❌ Huna ruhusa ya kuongeza watu.')

    await client.groupParticipantsUpdate(m.chat, [number], 'add')
    await m.reply(`✅ Namba ${args[0]} imeongezwa kwenye group! 🥳`)
  } catch (error) {
    console.error(error)
    await m.reply('❌ Imeshindikana kuongeza mtu kwenye group. Hakikisha namba iko sahihi na bot ana ruhusa.')
  }
}
